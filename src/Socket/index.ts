import { Socket } from 'socket.io-client';
import { Client } from 'whatsapp-web.js';
import { registerIntroductionSocketEvent } from './Emitting';
import * as handlers from './Handling';

export const registerSocketHandlers = (whatsappBoundary: Client, socket: Socket) => {
	socket.on('connect', () => {
		registerIntroductionSocketEvent(socket);
	});

	Object.entries(handlers).forEach(([evName, handler]) => {
		console.log(`Registering handler for event ${evName}`);
		socket.on(evName, handler(whatsappBoundary));
	});
};
