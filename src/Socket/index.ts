import { Socket } from 'socket.io-client';
import { Client } from 'whatsapp-web.js';
import { registerIntroductionSocketEvent } from './Emitting/Introduction';
import * as handlers from './Handling';

export const registerSocketHandlers = (whatsappBoundary: Client, socket: Socket) => {
	socket.on('connect', () => {
		registerIntroductionSocketEvent(socket);
	});

	Object.entries(handlers).forEach(([evName, handler]) => {
		socket.on(evName, handler(whatsappBoundary, socket));
	});
};
