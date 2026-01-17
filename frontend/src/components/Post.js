import React, { useState, useContext, useEffect } from 'react';
import { postService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import '../styles/Post.css';

export default function Post({ post, onDelete }) {
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(user?._id));
  }, [post, user]);

  const handleLike = async () => {
    try {
      const response = await postService.likePost(post._id);
      setIsLiked(response.data.likes.includes(user?._id));
      setLikes(response.data.likes.length);

      if (socket) {
        socket.emit('like_post', {
          postId: post._id,
          userId: user?._id,
          likes: response.data.likes
        });
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleShare = async () => {
    try {
      await postService.sharePost(post._id);
      alert('Post shared!');
    } catch (error) {
      console.error('Failed to share post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await postService.createPost !== undefined ? 
        (await commentService.addComment({
          postId: post._id,
          content: newComment
        })) : null;
      
      if (response) {
        setComments([...comments, response.data]);
        setNewComment('');

        if (socket) {
          socket.emit('new_comment', {
            postId: post._id,
            comment: response.data
          });
        }
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDelete = async () => {
    if (post.author._id !== user?._id) return;
    try {
      await postService.deletePost(post._id);
      onDelete?.(post._id);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">{post.author?.username?.[0]?.toUpperCase()}</div>
          <div className="author-info">
            <h4>{post.author?.username}</h4>
            <small>{new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
        {post.author._id === user?._id && (
          <button className="delete-btn" onClick={handleDelete}>×</button>
        )}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="post" />}
        {post.video && (
          <video controls>
            <source src={post.video} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="post-stats">
        <span>{likes} likes</span>
        <span>{comments.length} comments</span>
        <span>{post.shares.length} shares</span>
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          👍 Like
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 Comment
        </button>
        <button 
          className="action-btn"
          onClick={handleShare}
        >
          ↗️ Share
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-author">
                <strong>{comment.author?.username}</strong>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit">Comment</button>
          </form>
        </div>
      )}
    </div>
  );
}
