import React, { useState, useContext, useEffect } from 'react';
import { authService, friendService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import '../styles/Profile.css';

export const Profile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    loadProfile();
    if (user?._id === userId) {
      loadPendingRequests();
    }
  }, [userId, user]);

  const loadProfile = async () => {
    try {
      const response = await authService.getUserById(userId);
      setProfile(response.data);
      setIsFriend(response.data.friends?.includes(user?._id));
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await friendService.getPendingRequests();
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Failed to load pending requests:', error);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await friendService.sendFriendRequest(userId);
      if (socket) {
        socket.emit('friend_request_sent', {
          sender: user?._id,
          senderUsername: user?.username,
          receiverId: userId
        });
      }
      alert('Friend request sent!');
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      loadPendingRequests();
      loadProfile();
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await friendService.removeFriend(userId);
      setIsFriend(false);
      loadProfile();
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Profile not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">{profile.username?.[0]?.toUpperCase()}</div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p className="bio">{profile.bio || 'No bio yet'}</p>
          <p className="location">{profile.location}</p>
          <div className="stats">
            <div className="stat">
              <strong>{profile.followers?.length || 0}</strong>
              <span>Followers</span>
            </div>
            <div className="stat">
              <strong>{profile.following?.length || 0}</strong>
              <span>Following</span>
            </div>
            <div className="stat">
              <strong>{profile.friends?.length || 0}</strong>
              <span>Friends</span>
            </div>
          </div>
        </div>

        {user?._id !== userId && (
          <div className="action-buttons">
            {isFriend ? (
              <button className="remove-friend-btn" onClick={handleRemoveFriend}>
                Remove Friend
              </button>
            ) : (
              <button className="add-friend-btn" onClick={handleSendFriendRequest}>
                Add Friend
              </button>
            )}
          </div>
        )}
      </div>

      {user?._id === userId && pendingRequests.length > 0 && (
        <div className="pending-requests">
          <h3>Friend Requests ({pendingRequests.length})</h3>
          {pendingRequests.map(request => (
            <div key={request._id} className="request-item">
              <span>{request.sender.username}</span>
              <div className="request-buttons">
                <button 
                  className="accept-btn"
                  onClick={() => handleAcceptRequest(request._id)}
                >
                  Accept
                </button>
                <button className="reject-btn">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="profile-sections">
        <div className="friends-section">
          <h3>Friends</h3>
          <div className="friends-grid">
            {profile.friends?.map(friend => (
              <div key={friend._id} className="friend-card">
                <div className="friend-avatar">{friend.username?.[0]?.toUpperCase()}</div>
                <p>{friend.username}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
