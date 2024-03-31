import dotenv from 'dotenv';
dotenv.config();

import { io } from 'socket.io-client';
import whatsappBoundary from './Client';
import { registerSocketHandlers } from './Socket';

const socket = io(`${process.env.GATEWAY_URL}` || '127.0.0.1:4521', {
	path: process.env.SOCKET_PATH ?? '/socket.io/',
});

const wppClient = whatsappBoundary(socket);
wppClient.initialize();

registerSocketHandlers(wppClient, socket);
