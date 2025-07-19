// src/socket.js - Frontend socket connection setup

import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

export default socket;
