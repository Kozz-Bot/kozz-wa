import { Message } from 'whatsapp-web.js';
import { createMessageReveivedPayload } from './MessageReceived';

export const onMessageReceived = (message: Message) => {
	const payload = createMessageReveivedPayload(message);
	console.log(payload);
};
