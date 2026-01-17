import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎬 TheScene
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Feed</Link>
          </li>
          <li className="nav-item">
            <Link to="/messages" className="nav-link">Messages</Link>
          </li>
          <li className="nav-item">
            <Link to="/chat" className="nav-link">Chat Rooms</Link>
          </li>
          <li className="nav-item">
            <Link to="/playlists" className="nav-link">Playlists</Link>
          </li>
          <li className="nav-item">
            <Link to={`/profile/${user?._id}`} className="nav-link">Profile</Link>
          </li>
          <li className="nav-item">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
