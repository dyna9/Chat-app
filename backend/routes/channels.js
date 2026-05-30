const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get messages for a channel
router.get('/:channel', verifyToken, async (req, res) => {
  try {
    const { channel } = req.params;
    const user = await User.findById(req.userId);

    // Check access
    if (channel === 'staff' && !user.isOwner && !user.isMod) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ channel }).sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
