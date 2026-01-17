import React, { useState, useContext, useEffect } from 'react';
import { messageService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import '../styles/Messages.css';

export const DirectMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (data) => {
        if (selectedUser && data.sender === selectedUser._id) {
          setMessages(prev => [...prev, data]);
        }
      });

      return () => socket.off('receive_message');
    }
  }, [socket, selectedUser]);

  const loadConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await messageService.getConversation(userId);
      setMessages(response.data.reverse());
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await messageService.sendMessage({
        receiverId: selectedUser._id,
        content: newMessage
      });
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');

      if (socket) {
        socket.emit('send_message', {
          ...response.data,
          receiverId: selectedUser._id
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <h2>Messages</h2>
        {conversations.map(conv => (
          <div
            key={conv._id?.userId}
            className={`conversation-item ${selectedUser?._id === conv._id?.userId ? 'active' : ''}`}
            onClick={() => setSelectedUser({ _id: conv._id?.userId })}
          >
            <span>{conv._id?.userId}</span>
            <p className="last-message">{conv.lastMessage?.content?.substring(0, 50)}</p>
          </div>
        ))}
      </div>

      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h2>{selectedUser._id}</h2>
            </div>
            <div className="messages-area">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender === user?._id ? 'sent' : 'received'}`}>
                  <p>{msg.content}</p>
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="message-input">
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
          <div className="no-conversation">Select a conversation to start messaging</div>
        )}
      </div>
    </div>
  );
};
