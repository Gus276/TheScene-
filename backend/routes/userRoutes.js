const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', auth, userController.getProfile);
router.get('/user/:id', userController.getUserById);
router.put('/profile', auth, userController.updateProfile);
router.get('/search', userController.searchUsers);

// Friend requests
router.post('/friend-request', auth, userController.sendFriendRequest);
router.put('/friend-request/:requestId/accept', auth, userController.acceptFriendRequest);
router.put('/friend-request/:requestId/reject', auth, userController.rejectFriendRequest);
router.get('/friend-requests/pending', auth, userController.getPendingRequests);
router.delete('/friend/:friendId', auth, userController.removeFriend);

module.exports = router;
