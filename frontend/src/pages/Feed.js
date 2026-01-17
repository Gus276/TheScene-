import React, { useState, useContext, useEffect } from 'react';
import { postService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import Post from '../components/Post';
import '../styles/Feed.css';

export const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('post_liked', (data) => {
        setPosts(prev => prev.map(post => 
          post._id === data.postId ? { ...post, likes: data.likes } : post
        ));
      });

      socket.on('comment_added', (data) => {
        setPosts(prev => prev.map(post => 
          post._id === data.postId ? { ...post, comments: [...post.comments, data.comment] } : post
        ));
      });

      return () => {
        socket.off('post_liked');
        socket.off('comment_added');
      };
    }
  }, [socket]);

  const loadFeed = async () => {
    try {
      const response = await postService.getFeed();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await postService.createPost({ content });
      setPosts([response.data, ...posts]);
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  if (loading) return <div className="loading">Loading feed...</div>;

  return (
    <div className="feed-container">
      <div className="create-post">
        <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
        <form onSubmit={handlePostCreate}>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit">Post</button>
        </form>
      </div>

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map(post => <Post key={post._id} post={post} />)
        ) : (
          <p>No posts yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
};
