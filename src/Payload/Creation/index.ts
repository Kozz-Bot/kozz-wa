import { Socket } from 'socket.io-client';
import { Message } from 'whatsapp-web.js';
import { createMessageReveivedPayload } from './MessageReceived';

export const onMessageReceived = (socket: Socket) => async (message: Message) => {
	const payload = await createMessageReveivedPayload(message);
	if (message.body === '!ping') {
		console.log(message);
	}
	socket.emit('message', payload);
};
