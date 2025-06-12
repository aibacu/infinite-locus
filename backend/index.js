import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/user.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';  
import http from 'http';  
import documentRoutes from './routes/document.js';
 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                
}));
app.use(cookieParser());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  console.log("hi from server");
  res.send("hi");
});
app.use('/api/auth', authRoutes);
app.use('/api/document', documentRoutes);

 
 const server = http.createServer(app);  
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

   
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
    console.log(`Socket ${socket.id} joined document room: ${documentId}`);
  });

   
  socket.on('edit-document', ({ documentId, content }) => {
    socket.to(documentId).emit('receive-changes', content);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});