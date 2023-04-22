import dotenv from 'dotenv';
dotenv.config();

import { io } from 'socket.io-client';
import whatsappBoundary from './Client';
const socket = io('http://gramont.ddns.net:4521');

whatsappBoundary().initialize();

socket.on('connect', () => {
	console.log(socket.id);
	socket.emit('message', 'socorro');
});

socket.on('response', socket => {
	console.log(socket);
});
