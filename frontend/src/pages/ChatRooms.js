import React, { useState, useContext, useEffect } from 'react';
import { chatService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import '../styles/ChatRooms.css';

export const ChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    loadChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadRoomMessages(selectedRoom._id);
      if (socket) {
        socket.emit('join_chat_room', {
          chatRoomId: selectedRoom._id,
          userId: user?._id,
          username: user?.username
        });
      }
    }

    return () => {
      if (selectedRoom && socket) {
        socket.emit('leave_chat_room', {
          chatRoomId: selectedRoom._id,
          userId: user?._id,
          username: user?.username
        });
      }
    };
  }, [selectedRoom, socket, user]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_chat_message', (data) => {
        if (selectedRoom && data.chatRoomId === selectedRoom._id) {
          setRoomMessages(prev => [...prev, data]);
        }
      });

      socket.on('user_joined', (data) => {
        console.log(`${data.username} joined the room`);
      });

      return () => {
        socket.off('receive_chat_message');
        socket.off('user_joined');
      };
    }
  }, [socket, selectedRoom]);

  const loadChatRooms = async () => {
    try {
      const response = await chatService.getChatRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    }
  };

  const loadRoomMessages = async (roomId) => {
    try {
      const response = await chatService.getChatMessages(roomId);
      setRoomMessages(response.data.reverse());
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await chatService.createChatRoom({
        name: newRoomName,
        isPrivate
      });
      setRooms([...rooms, response.data]);
      setNewRoomName('');
      setShowCreateForm(false);
      setIsPrivate(false);
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const response = await chatService.sendChatMessage({
        chatRoomId: selectedRoom._id,
        content: newMessage
      });
      setRoomMessages(prev => [...prev, response.data]);
      setNewMessage('');

      if (socket) {
        socket.emit('chat_message', {
          ...response.data,
          chatRoomId: selectedRoom._id
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chatrooms-container">
      <div className="rooms-list">
        <h2>Chat Rooms</h2>
        <button 
          className="create-room-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Room'}
        </button>

        {showCreateForm && (
          <form onSubmit={handleCreateRoom} className="create-room-form">
            <input
              type="text"
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              required
            />
            <label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              Private
            </label>
            <button type="submit">Create</button>
          </form>
        )}

        <div className="rooms-scroll">
          {rooms.map(room => (
            <div
              key={room._id}
              className={`room-item ${selectedRoom?._id === room._id ? 'active' : ''}`}
              onClick={() => setSelectedRoom(room)}
            >
              <h3>{room.name}</h3>
              <p className="members-count">{room.members.length} members</p>
            </div>
          ))}
        </div>
      </div>

      <div className="room-chat">
        {selectedRoom ? (
          <>
            <div className="room-header">
              <h2>{selectedRoom.name}</h2>
              <p>{selectedRoom.members.length} members</p>
            </div>
            <div className="room-messages">
              {roomMessages.map((msg, idx) => (
                <div key={idx} className={`room-message ${msg.sender === user?._id ? 'sent' : 'received'}`}>
                  <strong>{msg.sender?.username || 'Unknown'}</strong>
                  <p>{msg.content}</p>
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="room-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-room">Select a room to start chatting</div>
        )}
      </div>
    </div>
  );
};
