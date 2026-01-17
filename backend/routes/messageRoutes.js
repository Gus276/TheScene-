const express = require('express');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, messageController.sendMessage);
router.get('/conversation/:userId', auth, messageController.getConversation);
router.get('/', auth, messageController.getConversations);
router.delete('/:id', auth, messageController.deleteMessage);
router.get('/unread/count', auth, messageController.getUnreadCount);

module.exports = router;
