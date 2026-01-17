const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatRoutes = require('./routes/chatRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thescene', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/playlists', playlistRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Socket.io Events
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user_status', { userId, status: 'online' });
  });

  socket.on('send_message', (data) => {
    io.to(onlineUsers.get(data.receiverId) || '').emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    io.to(onlineUsers.get(data.receiverId) || '').emit('user_typing', {
      userId: data.senderId,
      username: data.username
    });
  });

  socket.on('stop_typing', (data) => {
    io.to(onlineUsers.get(data.receiverId) || '').emit('user_stop_typing', {
      userId: data.senderId
    });
  });

  socket.on('join_chat_room', (data) => {
    socket.join(`chat_${data.chatRoomId}`);
    io.to(`chat_${data.chatRoomId}`).emit('user_joined', {
      userId: data.userId,
      username: data.username
    });
  });

  socket.on('leave_chat_room', (data) => {
    socket.leave(`chat_${data.chatRoomId}`);
    io.to(`chat_${data.chatRoomId}`).emit('user_left', {
      userId: data.userId,
      username: data.username
    });
  });

  socket.on('chat_message', (data) => {
    io.to(`chat_${data.chatRoomId}`).emit('receive_chat_message', data);
  });

  socket.on('like_post', (data) => {
    io.emit('post_liked', data);
  });

  socket.on('new_comment', (data) => {
    io.emit('comment_added', data);
  });

  socket.on('friend_request_sent', (data) => {
    io.to(onlineUsers.get(data.receiverId) || '').emit('friend_request_received', data);
  });

  socket.on('disconnect', () => {
    // Find and remove the disconnected user
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user_status', { userId, status: 'offline' });
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
