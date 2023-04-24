import { Socket } from 'socket.io-client';
import { Client } from 'whatsapp-web.js';
import { replyWithText } from './Handling';

export const registerSocketHandlers = (whatsappBoundary: Client, socket: Socket) => {
	socket.on('connect', () => {
		console.log(`[SERVIDOR] - CONEXÃO ESTABELECIDA COM ID ${socket.id}`);
	});

	socket.on('reply_message', replyWithText(whatsappBoundary));
};
