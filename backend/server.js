const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io Events
io.on('connection', (socket) => {
  console.log('🧑 New user connected:', socket.id);

  socket.on('join_room', (data) => {
    const { username, channel } = data;
    socket.join(channel);
    console.log(`${username} joined ${channel}`);
    
    io.to(channel).emit('user_joined', {
      username,
      message: `${username} joined the chat`,
      timestamp: new Date()
    });
  });

  socket.on('send_message', async (data) => {
    const { username, channel, message, userId } = data;
    
    // Save message to database
    const Message = require('./models/Message');
    try {
      const newMessage = new Message({
        username,
        userId,
        channel,
        content: message,
        timestamp: new Date()
      });
      await newMessage.save();
      
      // Broadcast to channel
      io.to(channel).emit('receive_message', {
        username,
        message,
        timestamp: new Date(),
        _id: newMessage._id
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('leave_room', (data) => {
    const { username, channel } = data;
    socket.leave(channel);
    io.to(channel).emit('user_left', {
      username,
      message: `${username} left the chat`,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('🧑 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
