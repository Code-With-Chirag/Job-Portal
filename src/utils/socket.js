import { io } from 'socket.io-client';

const socket = io('http://localhost:8000', {
    withCredentials: true,
    transports: ['websocket', 'polling'], // Try WebSocket first, then fallback to polling
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});


export default socket;
