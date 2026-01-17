const express = require('express');
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, chatController.createChatRoom);
router.get('/', chatController.getChatRooms);
router.get('/:id', chatController.getChatRoomById);
router.put('/:id', auth, chatController.updateChatRoom);
router.delete('/:id', auth, chatController.deleteChatRoom);
router.post('/:id/join', auth, chatController.joinChatRoom);
router.post('/:id/leave', auth, chatController.leaveChatRoom);

// Chat messages
router.post('/message/send', auth, chatController.sendChatMessage);
router.get('/:id/messages', chatController.getChatMessages);
router.delete('/message/:id', auth, chatController.deleteChatMessage);

module.exports = router;
