import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Store rooms in memory (in production, use Redis)
const rooms = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: dev ? 'http://localhost:3000' : process.env.PRODUCTION_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // NEW: Handle getting room state
    socket.on('getRoomState', ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (room) {
        socket.emit('roomState', room);
        console.log(`Sent room state for: ${roomCode}`);
      } else {
        socket.emit('error', { message: 'Room not found' });
      }
    });

    // Handle room creation
    socket.on('createRoom', async ({ gameType, userId, userName }) => {
      const roomCode = generateRoomCode();
      socket.join(roomCode);

      const roomData = {
        roomCode,
        gameType,
        host: { id: userId, name: userName },
        players: [{ id: userId, name: userName, socketId: socket.id }],
        status: 'waiting',
        createdAt: new Date(),
      };

      rooms.set(roomCode, roomData);
      socket.emit('roomCreated', roomData);
      console.log(`Room created: ${roomCode} by ${userName}`);
    });

    // Handle joining a room
    socket.on('joinRoom', async ({ roomCode, userId, userName }) => {
      const room = rooms.get(roomCode);

      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      if (room.players.length >= 10) {
        socket.emit('error', { message: 'Room is full' });
        return;
      }

      // Check if player is already in the room
      const existingPlayer = room.players.find((p) => p.id === userId);
      if (existingPlayer) {
        socket.join(roomCode);
        socket.emit('roomState', room);
        console.log(`User ${userName} rejoined room: ${roomCode}`);
        return;
      }

      socket.join(roomCode);

      const playerData = { id: userId, name: userName, socketId: socket.id };
      room.players.push(playerData);

      // Notify others in the room
      socket.to(roomCode).emit('playerJoined', playerData);

      // Send current room state to the new player
      socket.emit('roomState', room);

      console.log(`User ${userName} joined room: ${roomCode}`);
    });

    // Handle leaving a room
    socket.on('leaveRoom', ({ roomCode, userId, userName }) => {
      const room = rooms.get(roomCode);
      if (room) {
        room.players = room.players.filter((p) => p.id !== userId);

        // Delete room if empty
        if (room.players.length === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        }
      }

      socket.leave(roomCode);
      socket.to(roomCode).emit('playerLeft', { id: userId, name: userName });
      console.log(`User ${userName} left room: ${roomCode}`);
    });

    // Handle game start
    socket.on('startGame', ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (room) {
        room.status = 'active';
      }
      io.to(roomCode).emit('gameStarted', {
        status: 'active',
        startedAt: new Date(),
      });
      console.log(`Game started in room: ${roomCode}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      // Remove player from any rooms they were in
      rooms.forEach((room, roomCode) => {
        const playerIndex = room.players.findIndex(
          (p) => p.socketId === socket.id
        );
        if (playerIndex !== -1) {
          const player = room.players[playerIndex];
          room.players.splice(playerIndex, 1);

          io.to(roomCode).emit('playerLeft', {
            id: player.id,
            name: player.name,
          });

          // Delete room if empty
          if (room.players.length === 0) {
            rooms.delete(roomCode);
            console.log(`Room ${roomCode} deleted (empty)`);
          }
        }
      });
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

// Helper function to generate room codes
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
