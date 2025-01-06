import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';
import adminRoutes from './routes/admin.route.js';
import socketAuth from './middlewares/socketAuth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
};

app.use(cors(corsOptions));

const io = new Server(server, {
    cors: corsOptions,
    allowEIO3: true, // Allow Engine.IO version 3 clients
    transports: ['websocket', 'polling']
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Socket.IO setup
io.use(socketAuth);
io.on('connection', (socket) => {
    console.log('A user connected:', socket.user.id); // Assuming the decoded token has a user id
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);
app.use('/api/v1/admin', adminRoutes);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    connectDB();
    console.log(`Server running at Port ${PORT}`);
});

export { io }; // Export io to use in other files
