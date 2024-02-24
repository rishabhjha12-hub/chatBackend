// Import required modules
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

import cors from 'cors';

// Create Express app
const app = express();
const server = http.createServer(app);

// Create Socket.IO instance and attach it to the server
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:3001", // Replace with your React app's origin
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// API endpoint for sending messages with user name
app.post('/api/send-message', (req, res) => {
    const { message, userName } = req.body;
  
    // Broadcast the message and user name to all connected clients
    io.emit('chat message', { userName, message });
  
    res.json({ success: true, message: 'Message sent successfully' });
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for chat messages
  socket.on('chat message', ({ userName, message }) => {
    // Broadcast the message and user name to all connected clients
    io.emit('chat message', { userName, message });
  });
  
  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
