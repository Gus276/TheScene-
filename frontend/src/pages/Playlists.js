import React, { useState, useContext, useEffect } from 'react';
import { playlistService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Playlists.css';

export const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongArtist, setNewSongArtist] = useState('');
  const [newSongUrl, setNewSongUrl] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddSongForm, setShowAddSongForm] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const response = await playlistService.getPlaylists();
      setPlaylists(response.data);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const response = await playlistService.createPlaylist({
        name: newPlaylistName,
        isPublic: true
      });
      setPlaylists([...playlists, response.data]);
      setNewPlaylistName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    try {
      const response = await playlistService.addSongToPlaylist(selectedPlaylist._id, {
        title: newSongTitle,
        artist: newSongArtist,
        url: newSongUrl
      });
      setSelectedPlaylist(response.data);
      setNewSongTitle('');
      setNewSongArtist('');
      setNewSongUrl('');
      setShowAddSongForm(false);
    } catch (error) {
      console.error('Failed to add song:', error);
    }
  };

  const handleFollowPlaylist = async (playlistId) => {
    try {
      const response = await playlistService.followPlaylist(playlistId);
      setPlaylists(prev => prev.map(p => p._id === playlistId ? response.data : p));
    } catch (error) {
      console.error('Failed to follow playlist:', error);
    }
  };

  return (
    <div className="playlists-container">
      <div className="playlists-list">
        <h2>Music Playlists</h2>
        <button 
          className="create-playlist-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Playlist'}
        </button>

        {showCreateForm && (
          <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              required
            />
            <button type="submit">Create</button>
          </form>
        )}

        <div className="playlists-scroll">
          {playlists.map(playlist => (
            <div
              key={playlist._id}
              className={`playlist-item ${selectedPlaylist?._id === playlist._id ? 'active' : ''}`}
              onClick={() => setSelectedPlaylist(playlist)}
            >
              <h3>{playlist.name}</h3>
              <p>{playlist.songs.length} songs</p>
            </div>
          ))}
        </div>
      </div>

      <div className="playlist-detail">
        {selectedPlaylist ? (
          <>
            <div className="playlist-header">
              <h2>{selectedPlaylist.name}</h2>
              <p>{selectedPlaylist.songs.length} songs</p>
              {selectedPlaylist.owner !== user?._id && (
                <button 
                  className="follow-btn"
                  onClick={() => handleFollowPlaylist(selectedPlaylist._id)}
                >
                  {selectedPlaylist.followers?.includes(user?._id) ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>

            {selectedPlaylist.owner === user?._id && (
              <button 
                className="add-song-btn"
                onClick={() => setShowAddSongForm(!showAddSongForm)}
              >
                {showAddSongForm ? 'Cancel' : 'Add Song'}
              </button>
            )}

            {showAddSongForm && selectedPlaylist.owner === user?._id && (
              <form onSubmit={handleAddSong} className="add-song-form">
                <input
                  type="text"
                  placeholder="Song title"
                  value={newSongTitle}
                  onChange={(e) => setNewSongTitle(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Artist"
                  value={newSongArtist}
                  onChange={(e) => setNewSongArtist(e.target.value)}
                  required
                />
                <input
                  type="url"
                  placeholder="Song URL"
                  value={newSongUrl}
                  onChange={(e) => setNewSongUrl(e.target.value)}
                  required
                />
                <button type="submit">Add Song</button>
              </form>
            )}

            <div className="songs-list">
              {selectedPlaylist.songs?.map((song, idx) => (
                <div key={idx} className="song-item">
                  <div className="song-info">
                    <h4>{song.title}</h4>
                    <p>{song.artist}</p>
                  </div>
                  <audio controls style={{ width: '100%' }}>
                    <source src={song.url} type="audio/mpeg" />
                  </audio>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-playlist">Select a playlist to view details</div>
        )}
      </div>
    </div>
  );
};
