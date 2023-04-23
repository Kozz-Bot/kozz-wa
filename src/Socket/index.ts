import { Socket } from 'socket.io-client';
import { Client } from 'whatsapp-web.js';
import { SendMessagePayload } from './models';

export const registerSocketHandlers = (whatsappBoundary: Client, socket: Socket) => {
	socket.on('send_message', (payload: SendMessagePayload) => {
		console.log('received message', payload.body);
		whatsappBoundary.sendMessage(payload.chatId, payload.body);
	});
};
