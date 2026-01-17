const express = require('express');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, commentController.addComment);
router.get('/:postId', commentController.getPostComments);
router.post('/:id/like', auth, commentController.likeComment);
router.delete('/:id', auth, commentController.deleteComment);
router.put('/:id', auth, commentController.updateComment);

module.exports = router;
