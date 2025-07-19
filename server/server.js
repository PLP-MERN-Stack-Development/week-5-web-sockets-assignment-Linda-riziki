//Socket.io Chat Server (Express + WebSocket)

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow frontend to connect
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const users = {};
const messages = [];
const typingUsers = {};

// WebSocket connection
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    console.log(`${username} joined`);

    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
  });

  socket.on('send_message', ({ message }) => {
    const user = users[socket.id];
    const chatMessage = {
      id: Date.now(),
      sender: user?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
    };

    messages.push(chatMessage);
    if (messages.length > 100) messages.shift();

    io.emit('receive_message', chatMessage);
  });

  socket.on('typing', (isTyping) => {
    const username = users[socket.id]?.username;
    if (isTyping) {
      typingUsers[socket.id] = username;
    } else {
      delete typingUsers[socket.id];
    }
    io.emit('typing_users', Object.values(typingUsers));
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      console.log(`${user.username} disconnected`);
      delete users[socket.id];
      delete typingUsers[socket.id];
      io.emit('user_list', Object.values(users));
      io.emit('typing_users', Object.values(typingUsers));
    }
  });
});

// API routes
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
