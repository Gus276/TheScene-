const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, image, video } = req.body;

    if (req.userId === receiverId) {
      return res.status(400).json({ message: 'Cannot message yourself' });
    }

    const message = new DirectMessage({
      sender: req.userId,
      receiver: receiverId,
      content,
      image,
      video
    });

    await message.save();
    await message.populate('sender', 'username profilePicture');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await DirectMessage.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId }
      ]
    })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Mark as read
    await DirectMessage.updateMany(
      {
        sender: userId,
        receiver: req.userId,
        isRead: false
      },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const messages = await DirectMessage.aggregate([
      {
        $match: {
          $or: [
            { sender: { $oid: req.userId } },
            { receiver: { $oid: req.userId } }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', { $oid: req.userId }] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await DirectMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await DirectMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await DirectMessage.countDocuments({
      receiver: req.userId,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
