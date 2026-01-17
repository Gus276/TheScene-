# 🚀 TheScene - START HERE!

## Your Complete Social Media App is Ready! ✅

This file will help you get everything running.

---

## ⚡ QUICK START (5 minutes)

### Step 1: Install Backend
```bash
cd backend
npm install
cp .env.example .env
```

### Step 2: Install Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

### Step 3: Start MongoDB
```bash
# If MongoDB is installed locally:
mongod

# OR if using MongoDB Atlas, just update MONGODB_URI in backend/.env
```

### Step 4: Start Backend
```bash
cd backend
npm run dev
# ✅ Server runs on http://localhost:5000
```

### Step 5: Start Frontend (new terminal)
```bash
cd frontend
npm start
# ✅ App opens at http://localhost:3000
```

### Step 6: Test It!
1. Go to http://localhost:3000
2. Register a new account
3. Create a post
4. Start exploring!

---

## 📋 WHAT YOU GET

✅ **Direct Messaging** - Real-time one-on-one chats
✅ **Public Chat Rooms** - Join group conversations
✅ **Private Chat Rooms** - Exclusive group chats
✅ **Image & Video Sharing** - Upload media everywhere
✅ **Music Playlists** - Create and manage music
✅ **Friend System** - Send requests, manage friends
✅ **Posts & Feed** - Like, comment, share content
✅ **Real-Time Updates** - Everything happens instantly
✅ **User Profiles** - Customize your profile
✅ **Search Users** - Find and connect with people

---

## 🗂️ PROJECT STRUCTURE

```
TheScene/
├── backend/              # Node.js/Express backend
│   ├── models/          # Database schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & file upload
│   ├── server.js        # Main app
│   └── package.json
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/       # Feed, Messages, Chat, etc.
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth & Socket context
│   │   ├── services/    # API calls
│   │   ├── styles/      # CSS files
│   │   └── App.js       # Main app
│   └── package.json
│
├── SETUP.md             # Detailed setup guide
├── PROJECT_SUMMARY.md   # What was built
└── DEVELOPER_GUIDE.md   # Developer reference
```

---

## 🎯 FEATURES GUIDE

### Create Posts
1. Go to Feed
2. Write something in the text box
3. Click "Post"
4. Like, comment, and share posts

### Message Someone
1. Go to Messages
2. Search for a user
3. Click to open conversation
4. Type and send messages

### Join Chat Rooms
1. Go to Chat Rooms
2. Click a room to join
3. Type and send room messages
4. See who's online

### Create Playlist
1. Go to Playlists
2. Click "Create Playlist"
3. Add songs with title/artist/URL
4. Share with friends

### Make Friends
1. Go to Profile or search users
2. Click "Add Friend"
3. They'll get a friend request
4. Once accepted, you're friends!

---

## 🔧 TROUBLESHOOTING

### MongoDB Error
**Problem**: "MongoDB connection failed"
**Solution**: 
- Make sure MongoDB is running: `mongod`
- OR update `MONGODB_URI` in `backend/.env` to use MongoDB Atlas

### Socket Connection Error
**Problem**: "Socket connection refused"
**Solution**:
- Make sure backend is running on port 5000
- Check `REACT_APP_SOCKET_URL` in `frontend/.env`

### Port Already in Use
**Problem**: "Address already in use :5000"
**Solution**:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Use `PORT=3001 npm start`

### Can't Connect to Backend
**Problem**: "Failed to fetch"
**Solution**:
- Check backend is running
- Check `REACT_APP_API_URL` in `frontend/.env`

---

## 🔑 CREDENTIALS TO REMEMBER

### Environment Variables

**Backend** (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thescene
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 📱 MAIN FEATURES EXPLAINED

### Feed
- View all posts from everyone
- Create new posts with text/images/videos
- Like, comment, and share posts

### Messages
- Send private messages to friends
- See message history
- Real-time message delivery
- Typing indicators

### Chat Rooms
- Join public rooms to chat with groups
- Create private rooms
- Real-time messages
- See who's typing

### Playlists
- Create music playlists
- Add songs (provide URL)
- Built-in audio player
- Follow other playlists

### Profile
- View and edit your profile
- See your friends
- View pending friend requests
- Browse other user profiles

---

## 🎨 USEFUL TIPS

1. **Search Users**: Use the search feature to find people
2. **Real-Time Updates**: Everything updates instantly!
3. **Try All Rooms**: Join different chat rooms to chat with groups
4. **Share Music**: Add your favorite songs to playlists
5. **Stay Connected**: Add friends and message them

---

## 📚 MORE INFORMATION

- **Detailed Setup**: See `SETUP.md`
- **Developer Guide**: See `DEVELOPER_GUIDE.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`

---

## ✨ YOU'RE ALL SET!

### To start:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

### Then visit:
**http://localhost:3000**

---

## 🆘 NEED HELP?

1. Check the documentation files
2. Look at the code comments
3. Check the error messages
4. Review SETUP.md or DEVELOPER_GUIDE.md

---

## 🚀 LET'S GO!

Your social media app is ready to use. Register, create content, chat with friends, and enjoy!

**Happy coding! 🎉**
