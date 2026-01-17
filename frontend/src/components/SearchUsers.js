import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Search.css';

export const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 2) {
      searchUsers();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await authService.searchUsers(query);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    navigate(`/profile/${userId}`);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      
      {isLoading && <p>Loading...</p>}
      
      <div className="search-results">
        {results.map(user => (
          <div 
            key={user._id} 
            className="search-result-item"
            onClick={() => handleSelectUser(user._id)}
          >
            <div className="result-avatar">{user.username?.[0]?.toUpperCase()}</div>
            <div className="result-info">
              <h4>{user.username}</h4>
              <p>{user.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
