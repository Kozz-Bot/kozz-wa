import { Socket } from 'socket.io-client';
import { Message } from 'whatsapp-web.js';
import { createMessageReveivedPayload } from './MessageReceived';

export const onMessageReceived = (socket: Socket) => async (message: Message) => {
	try {
		const payload = await createMessageReveivedPayload(message);
		socket.emit('message', payload);
	} catch (e) {
		console.warn(`Error on message: ${e}`);
	}
};
