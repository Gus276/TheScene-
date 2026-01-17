const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const { generateToken } = require('../utils/auth');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture')
      .populate('friends', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture')
      .populate('friends', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, location, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, bio, location, profilePicture, updatedAt: Date.now() },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('username email profilePicture bio');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (req.userId === receiverId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    let friendRequest = await FriendRequest.findOne({
      sender: req.userId,
      receiver: receiverId
    });

    if (friendRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    friendRequest = new FriendRequest({
      sender: req.userId,
      receiver: receiverId
    });

    await friendRequest.save();
    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.receiver.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    friendRequest.status = 'accepted';
    friendRequest.respondedAt = Date.now();
    await friendRequest.save();

    // Add to friends list
    await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { friends: friendRequest.sender } }
    );
    await User.findByIdAndUpdate(
      friendRequest.sender,
      { $addToSet: { friends: req.userId } }
    );

    res.json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.receiver.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    friendRequest.status = 'rejected';
    friendRequest.respondedAt = Date.now();
    await friendRequest.save();

    res.json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.userId,
      status: 'pending'
    }).populate('sender', 'username profilePicture bio');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;

    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { friends: friendId } }
    );
    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: req.userId } }
    );

    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
