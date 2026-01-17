import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Service
export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  getUserById: (id) => api.get(`/users/user/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  searchUsers: (query) => api.get('/users/search', { params: { query } })
};

// Post Service
export const postService = {
  createPost: (data) => api.post('/posts', data),
  getFeed: (page = 1, limit = 20) => api.get('/posts/feed', { params: { page, limit } }),
  getPostById: (id) => api.get(`/posts/${id}`),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  sharePost: (id) => api.post(`/posts/${id}/share`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`)
};

// Comment Service
export const commentService = {
  addComment: (data) => api.post('/comments', data),
  getPostComments: (postId) => api.get(`/comments/${postId}`),
  likeComment: (id) => api.post(`/comments/${id}/like`),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  updateComment: (id, data) => api.put(`/comments/${id}`, data)
};

// Message Service
export const messageService = {
  sendMessage: (data) => api.post('/messages', data),
  getConversation: (userId, page = 1, limit = 50) => 
    api.get(`/messages/conversation/${userId}`, { params: { page, limit } }),
  getConversations: () => api.get('/messages'),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
  getUnreadCount: () => api.get('/messages/unread/count')
};

// Chat Service
export const chatService = {
  createChatRoom: (data) => api.post('/chat', data),
  getChatRooms: (isPrivate) => api.get('/chat', { params: { isPrivate } }),
  getChatRoomById: (id) => api.get(`/chat/${id}`),
  updateChatRoom: (id, data) => api.put(`/chat/${id}`, data),
  deleteChatRoom: (id) => api.delete(`/chat/${id}`),
  joinChatRoom: (id) => api.post(`/chat/${id}/join`),
  leaveChatRoom: (id) => api.post(`/chat/${id}/leave`),
  sendChatMessage: (data) => api.post('/chat/message/send', data),
  getChatMessages: (id, page = 1, limit = 50) => 
    api.get(`/chat/${id}/messages`, { params: { page, limit } }),
  deleteChatMessage: (id) => api.delete(`/chat/message/${id}`)
};

// Playlist Service
export const playlistService = {
  createPlaylist: (data) => api.post('/playlists', data),
  getPlaylists: () => api.get('/playlists'),
  getUserPlaylists: (userId) => api.get(`/playlists/user/${userId}`),
  getPlaylistById: (id) => api.get(`/playlists/${id}`),
  updatePlaylist: (id, data) => api.put(`/playlists/${id}`, data),
  deletePlaylist: (id) => api.delete(`/playlists/${id}`),
  addSongToPlaylist: (id, data) => api.post(`/playlists/${id}/song`, data),
  removeSongFromPlaylist: (id, data) => api.delete(`/playlists/${id}/song`, { data }),
  followPlaylist: (id) => api.post(`/playlists/${id}/follow`)
};

// Friend Service
export const friendService = {
  sendFriendRequest: (receiverId) => api.post('/users/friend-request', { receiverId }),
  acceptFriendRequest: (requestId) => api.put(`/users/friend-request/${requestId}/accept`),
  rejectFriendRequest: (requestId) => api.put(`/users/friend-request/${requestId}/reject`),
  getPendingRequests: () => api.get('/users/friend-requests/pending'),
  removeFriend: (friendId) => api.delete(`/users/friend/${friendId}`)
};

export default api;
