const express = require('express');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, postController.createPost);
router.get('/feed', auth, postController.getFeed);
router.get('/:id', postController.getPostById);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/like', auth, postController.likePost);
router.post('/:id/share', auth, postController.sharePost);
router.get('/user/:userId', postController.getUserPosts);

module.exports = router;
