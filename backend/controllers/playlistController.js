const Playlist = require('../models/Playlist');

exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = new Playlist({
      name,
      description,
      isPublic,
      owner: req.userId
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('owner', 'username profilePicture')
      .populate('followers', 'username')
      .sort({ createdAt: -1 });

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.params;
    const playlists = await Playlist.find({ owner: userId })
      .populate('owner', 'username profilePicture')
      .populate('followers', 'username');

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('owner', 'username profilePicture email')
      .populate('followers', 'username profilePicture');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    const { title, artist, url, duration, coverImage } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    playlist.songs.push({
      title,
      artist,
      url,
      duration,
      coverImage
    });

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { songIndex } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    playlist.songs.splice(songIndex, 1);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.followers.includes(req.userId)) {
      playlist.followers = playlist.followers.filter(id => id.toString() !== req.userId);
    } else {
      playlist.followers.push(req.userId);
    }

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;
    playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;
    playlist.updatedAt = Date.now();

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
