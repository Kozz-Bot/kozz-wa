import { Socket } from 'socket.io-client';
import { Message, MessageMedia } from 'whatsapp-web.js';
import { createMessageReveivedPayload } from './MessageReceived';

export const onMessageReceived = (socket: Socket) => async (message: Message) => {
	const payload = await createMessageReveivedPayload(message);
	socket.emit('message', payload);
};
