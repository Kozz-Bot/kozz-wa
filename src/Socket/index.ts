import { Socket } from 'socket.io-client';
import { Client } from 'whatsapp-web.js';
import { registerIntroductionSocketEvent } from './Emitting';
import { replyWithText } from './Handling';

export const registerSocketHandlers = (whatsappBoundary: Client, socket: Socket) => {
	socket.on('connect', () => {
		registerIntroductionSocketEvent(socket);
	});

	socket.on('reply_message', replyWithText(whatsappBoundary));
};
