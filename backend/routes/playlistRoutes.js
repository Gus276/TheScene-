const express = require('express');
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, playlistController.createPlaylist);
router.get('/', playlistController.getPlaylists);
router.get('/user/:userId', playlistController.getUserPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.put('/:id', auth, playlistController.updatePlaylist);
router.delete('/:id', auth, playlistController.deletePlaylist);
router.post('/:id/song', auth, playlistController.addSongToPlaylist);
router.delete('/:id/song', auth, playlistController.removeSongFromPlaylist);
router.post('/:id/follow', auth, playlistController.followPlaylist);

module.exports = router;
