const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.addComment = async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;

    const comment = new Comment({
      post: postId,
      author: req.userId,
      content,
      parentComment: parentCommentId || null
    });

    await comment.save();
    await comment.populate('author', 'username profilePicture');

    // Add comment to post
    const post = await Post.findById(postId);
    if (post) {
      post.comments.push(comment._id);
      await post.save();
    }

    // Add reply to parent comment
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({
      post: postId,
      parentComment: null
    })
      .populate('author', 'username profilePicture')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username profilePicture' }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.likes.includes(req.userId)) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.userId);
    } else {
      comment.likes.push(req.userId);
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    // Remove from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
