# TheScene - Developer Quick Reference

## 🎯 Features Implemented

### Core Features
- [x] User authentication with JWT
- [x] User profiles and profile updates
- [x] User search functionality
- [x] Friend request system
- [x] Friends management

### Social Features
- [x] Create/Edit/Delete posts
- [x] Like posts and comments
- [x] Share posts
- [x] Comment on posts
- [x] Nested comment replies
- [x] Real-time feed

### Messaging
- [x] Direct messaging
- [x] Conversation history
- [x] Typing indicators
- [x] Unread message counter

### Chat Rooms
- [x] Create chat rooms
- [x] Public chat rooms
- [x] Private chat rooms
- [x] Join/Leave rooms
- [x] Real-time messages
- [x] User joined/left notifications

### Media & Playlists
- [x] Image uploads
- [x] Video uploads
- [x] Music playlists
- [x] Add/Remove songs
- [x] Follow playlists
- [x] Audio player

## 📁 File Organization

```
backend/
├── models/          # Database schemas
├── controllers/     # Business logic
├── routes/         # API endpoints
├── middleware/     # Auth, uploads
├── utils/          # Helpers
├── uploads/        # Media storage
└── server.js       # Express app + Socket.io

frontend/
├── src/
│   ├── pages/      # Full page components
│   ├── components/ # Reusable components
│   ├── context/    # Auth & Socket context
│   ├── services/   # API calls
│   ├── styles/     # CSS files
│   └── App.js      # Main app
└── public/         # Static files
```

## 🔑 Key Technologies

- **Node.js/Express** - Backend framework
- **MongoDB** - Database
- **Socket.io** - Real-time communication
- **React** - Frontend library
- **JWT** - Authentication
- **Multer** - File uploads

## 🛠️ Development Workflow

### Add a New Feature

1. Create model in `backend/models/Feature.js`
2. Add controller logic in `backend/controllers/featureController.js`
3. Define routes in `backend/routes/featureRoutes.js`
4. Add API service in `frontend/src/services/api.js`
5. Create UI component in `frontend/src/components/Feature.js`
6. Add styling in `frontend/src/styles/Feature.css`
7. Integrate into main app

### Important Files to Know

- `backend/server.js` - Socket.io setup, main entry
- `backend/models/User.js` - User authentication logic
- `frontend/src/context/AuthContext.js` - Auth state
- `frontend/src/context/SocketContext.js` - Socket events
- `frontend/src/App.js` - Route configuration

## 📡 Socket.io Events

**Sent by Client:**
- `user_online` - User comes online
- `send_message` - Send DM
- `typing` - Typing indicator
- `join_chat_room` - Join room
- `chat_message` - Send room message

**Received by Client:**
- `user_status` - User online/offline
- `receive_message` - New DM
- `user_typing` - Typing indicator
- `receive_chat_message` - New room message

## 🔐 Authentication Flow

1. User registers/logs in → Backend creates JWT
2. JWT stored in localStorage
3. JWT included in all API requests
4. Backend verifies JWT via auth middleware
5. Protected routes check authentication

## 🎯 Common Tasks

### Add a new API endpoint

```javascript
// Route: routes/featureRoutes.js
router.get('/new-endpoint', auth, featureController.newEndpoint);

// Controller: controllers/featureController.js
exports.newEndpoint = async (req, res) => {
  try {
    // Your logic
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Handle real-time updates

```javascript
// Listen for Socket events
useEffect(() => {
  if (socket) {
    socket.on('event_name', (data) => {
      // Update state
      setData(prev => [...prev, data]);
    });
    return () => socket.off('event_name');
  }
}, [socket]);
```

### Add protected route

```javascript
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  }
/>
```

## 🧪 Testing Endpoints

### Using curl

```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get profile (replace TOKEN)
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

## 🚀 Deployment Checklist

- [ ] Update environment variables for production
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas (not local)
- [ ] Enable CORS for production domain
- [ ] Set strong JWT_SECRET
- [ ] Use HTTPS
- [ ] Build frontend: `npm run build`
- [ ] Deploy backend to hosting service
- [ ] Deploy frontend to hosting service

## 📚 Useful Resources

- Express Docs: https://expressjs.com/
- MongoDB Docs: https://docs.mongodb.com/
- React Docs: https://react.dev/
- Socket.io Docs: https://socket.io/docs/
- JWT Docs: https://jwt.io/

## 💡 Tips & Best Practices

1. Always include error handling in try-catch blocks
2. Validate input data before processing
3. Use consistent naming conventions
4. Add JSDoc comments for functions
5. Keep components small and reusable
6. Use context for global state
7. Protect sensitive routes with authentication
8. Test API endpoints before using in frontend

---

**Happy Developing! 🚀**
