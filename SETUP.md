# SETUP AND INSTALLATION GUIDE

## TheScene - Full-Stack Social Media App

A comprehensive social media application with all requested features.

### ✅ Included Features

1. **Direct Messaging** - Real-time one-on-one messaging
2. **Public Chat Rooms** - Community chat spaces
3. **Private Chat Rooms** - Exclusive group chats
4. **Image & Video Sharing** - Upload media to posts and messages
5. **Music Playlists** - Create and manage music playlists
6. **Friend Requests** - Send and manage friend connections
7. **Friends System** - View and manage your friend list
8. **Comments** - Comment on posts with nested replies
9. **Likes** - Like posts and comments
10. **Shares** - Share posts with your network

---

## 🚀 Quick Start

### Backend Installation

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start MongoDB (if local)
mongod

# Start backend server (requires MongoDB running)
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Installation

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start frontend
npm start
# App opens at http://localhost:3000
```

---

## 📂 Complete Project Structure

### Backend Files
- `server.js` - Main Express server with Socket.io
- `models/` - MongoDB schemas for all data entities
- `controllers/` - Business logic for each feature
- `routes/` - API endpoint definitions
- `middleware/` - Authentication and file upload handlers
- `utils/` - JWT token generation utilities

### Frontend Files
- `src/App.js` - Main app with routing
- `src/pages/` - Feed, Messages, Chat, Playlists, Profile, Auth
- `src/components/` - Reusable components (Navbar, Post, SearchUsers)
- `src/context/` - Auth and Socket.io context providers
- `src/services/` - API service calls
- `src/styles/` - Component styling

---

## 🔧 Configuration

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thescene
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 📱 Features Overview

### User System
- Register and login with JWT authentication
- User profiles with bio and location
- Search users
- View user profiles

### Feed & Posts
- Create posts with text, images, or videos
- Like posts
- Share posts
- Comment on posts
- Like comments
- Real-time updates

### Messaging
- Send direct messages to other users
- See conversation history
- Real-time message delivery
- Message typing indicators

### Chat Rooms
- Create public or private chat rooms
- Join/leave chat rooms
- Send messages in rooms
- See online users

### Music Playlists
- Create public/private playlists
- Add songs to playlists
- Built-in audio player
- Follow other playlists

### Friend System
- Send friend requests
- Accept/reject requests
- View pending requests
- Remove friends
- See friend lists

---

## 🌐 API Reference

All endpoints require JWT token in Authorization header (except auth endpoints)

### Auth
- `POST /api/users/register`
- `POST /api/users/login`

### Users
- `GET /api/users/profile`
- `GET /api/users/user/:id`
- `PUT /api/users/profile`
- `GET /api/users/search?query=text`

### Posts
- `POST /api/posts`
- `GET /api/posts/feed`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/share`

### Messages
- `POST /api/messages`
- `GET /api/messages/conversation/:userId`
- `GET /api/messages`

### Chat Rooms
- `POST /api/chat`
- `GET /api/chat`
- `POST /api/chat/:id/join`
- `POST /api/chat/:id/leave`

### Playlists
- `POST /api/playlists`
- `GET /api/playlists`
- `POST /api/playlists/:id/song`

### Friends
- `POST /api/users/friend-request`
- `PUT /api/users/friend-request/:requestId/accept`
- `GET /api/users/friend-requests/pending`

---

## 🎯 Usage Workflow

1. **Register/Login** - Create account at `/register` or login at `/login`
2. **Create Posts** - Go to Feed and share content
3. **Find Friends** - Search users and send friend requests
4. **Direct Chat** - Message friends privately
5. **Join Rooms** - Join public or private chat rooms
6. **Create Playlist** - Build music playlists
7. **Interact** - Like, comment, and share content

---

## 🔌 Real-Time Features (Socket.io)

- User online/offline status
- Live message delivery
- Typing indicators
- Real-time post likes
- Chat room notifications

---

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in backend .env

**Socket Connection Error**
- Ensure backend server is running on port 5000
- Check REACT_APP_SOCKET_URL in frontend .env

**Port Already in Use**
- Backend: Change PORT in .env
- Frontend: Use `PORT=3001 npm start`

---

## 📦 Dependencies

### Backend
- express, mongoose, socket.io, jwt, bcryptjs, multer, cors

### Frontend
- react, react-router-dom, axios, socket.io-client, react-icons

---

## 🎨 UI Highlights

- Modern, clean design
- Responsive layout
- Real-time updates
- Intuitive navigation
- Dark/Light color scheme ready

---

## ✨ Project Complete!

All requested features have been fully implemented:
✅ Direct Messaging
✅ Public Chat Rooms
✅ Private Chat Rooms
✅ Image & Video Sharing
✅ Music Playlists
✅ Friend Requests
✅ Friends System
✅ Comments
✅ Likes
✅ Shares

Happy coding! 🚀
