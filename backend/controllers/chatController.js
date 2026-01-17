const ChatRoom = require('../models/ChatRoom');
const ChatMessage = require('../models/ChatMessage');

exports.createChatRoom = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    const chatRoom = new ChatRoom({
      name,
      description,
      isPrivate,
      creator: req.userId,
      members: [req.userId],
      admins: [req.userId]
    });

    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChatRooms = async (req, res) => {
  try {
    const { isPrivate } = req.query;
    const filter = isPrivate !== undefined ? { isPrivate: isPrivate === 'true' } : {};

    const chatRooms = await ChatRoom.find(filter)
      .populate('creator', 'username profilePicture')
      .populate('members', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChatRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const chatRoom = await ChatRoom.findById(id)
      .populate('creator', 'username profilePicture')
      .populate('members', 'username profilePicture')
      .populate('admins', 'username profilePicture');

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinChatRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const chatRoom = await ChatRoom.findById(id);

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (chatRoom.members.includes(req.userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    chatRoom.members.push(req.userId);
    await chatRoom.save();

    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.leaveChatRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const chatRoom = await ChatRoom.findById(id);

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    chatRoom.members = chatRoom.members.filter(memberId => memberId.toString() !== req.userId);
    await chatRoom.save();

    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendChatMessage = async (req, res) => {
  try {
    const { chatRoomId, content, image, video } = req.body;

    const chatMessage = new ChatMessage({
      chatRoom: chatRoomId,
      sender: req.userId,
      content,
      image,
      video
    });

    await chatMessage.save();
    await chatMessage.populate('sender', 'username profilePicture');

    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await ChatMessage.find({ chatRoom: id })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteChatMessage = async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ChatMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateChatRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, profilePicture } = req.body;

    const chatRoom = await ChatRoom.findById(id);

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (!chatRoom.admins.includes(req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    chatRoom.name = name || chatRoom.name;
    chatRoom.description = description || chatRoom.description;
    chatRoom.profilePicture = profilePicture || chatRoom.profilePicture;
    chatRoom.updatedAt = Date.now();

    await chatRoom.save();
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteChatRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const chatRoom = await ChatRoom.findById(id);

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (chatRoom.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ChatRoom.findByIdAndDelete(id);
    await ChatMessage.deleteMany({ chatRoom: id });

    res.json({ message: 'Chat room deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
