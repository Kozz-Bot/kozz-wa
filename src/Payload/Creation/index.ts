import { Socket } from 'socket.io-client';
import { Message } from 'whatsapp-web.js';
import { createMessageReveivedPayload } from './MessageReceived';

export const onMessageReceived = (socket: Socket) => (message: Message) => {
	const payload = createMessageReveivedPayload(message);
	socket.emit('message', payload.body);
};
