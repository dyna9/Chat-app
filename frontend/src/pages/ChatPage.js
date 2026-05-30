import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';

function ChatPage({ user, onLogout, token }) {
  const navigate = useNavigate();
  const [currentChannel, setCurrentChannel] = useState('general');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join_room', { username: user.username, channel: currentChannel });
      fetchMessages();
    });

    newSocket.on('receive_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    newSocket.on('user_joined', (data) => {
      console.log('User joined:', data.username);
      setMessages(prev => [...prev, { ...data, isSystemMessage: true }]);
    });

    newSocket.on('user_left', (data) => {
      console.log('User left:', data.username);
      setMessages(prev => [...prev, { ...data, isSystemMessage: true }]);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/channels/${currentChannel}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChannelChange = (channel) => {
    if (channel === 'staff' && !user.isOwner && !user.isMod) {
      alert('You do not have access to the staff channel');
      return;
    }
    setCurrentChannel(channel);
    setMessages([]);
    socket?.emit('leave_room', { username: user.username, channel: currentChannel });
    socket?.emit('join_room', { username: user.username, channel });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket?.emit('send_message', {
        username: user.username,
        userId: user._id,
        channel: currentChannel,
        message: newMessage
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Chat</h2>
        </div>
        
        <div className="channels">
          <h3>Channels</h3>
          <button
            className={`channel-btn ${currentChannel === 'general' ? 'active' : ''}`}
            onClick={() => handleChannelChange('general')}
          >
            # general
          </button>
          {(user.isOwner || user.isMod) && (
            <button
              className={`channel-btn staff ${currentChannel === 'staff' ? 'active' : ''}`}
              onClick={() => handleChannelChange('staff')}
            >
              # staff
            </button>
          )}
        </div>

        <div className="user-info">
          <div className="user-details">
            <p><strong>{user.username}</strong></p>
            <p className="user-role">{user.isOwner ? '👑 Owner' : user.isMod ? '🛡️ Moderator' : 'User'}</p>
          </div>
          {user.isOwner && (
            <button 
              className="admin-btn"
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </button>
          )}
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h2>#{currentChannel}</h2>
          <p className="channel-description">
            {currentChannel === 'general' ? 'General discussion' : 'Staff only channel'}
          </p>
        </div>

        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.isSystemMessage ? 'system' : ''}`}>
              {!msg.isSystemMessage && (
                <div className="message-header">
                  <span className="username">{msg.username}</span>
                  <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              )}
              <p className="message-content">{msg.message || msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder={`Message #${currentChannel}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <button type="submit" className="send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
