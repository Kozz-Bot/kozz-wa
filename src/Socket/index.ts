import { Socket } from 'socket.io-client';
import { Client } from 'whatsapp-web.js';
import { SendMessagePayload } from 'kozz-types';

export const registerSocketHandlers = (whatsappBoundary: Client, socket: Socket) => {
	socket.on('connect', () => {
		console.log(`[SERVIDOR] - CONEXÃO ESTABELECIDA COM ID ${socket.id}`);
	});

	socket.on('reply_message', (payload: SendMessagePayload) => {
		console.log('received message', payload);
		whatsappBoundary.sendMessage(payload.chatId, payload.body, {
			quotedMessageId: payload.quoteId,
		});
	});
};
