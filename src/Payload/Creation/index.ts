import { Socket } from 'socket.io-client';
import { Client, Message } from 'whatsapp-web.js';
import { createMessageReceivedPayload } from './MessageReceived';

export const onMessageReceived =
	(socket: Socket, whatsappBoundary: Client) => async (message: Message) => {
		try {
			const payload = await createMessageReceivedPayload(message, whatsappBoundary);
			socket.emit('message', payload);
		} catch (e) {
			console.warn(`Error on message: ${e}`);
		}
	};
