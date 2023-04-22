import { Message } from 'whatsapp-web.js';
import { MessageReceived } from './models';

// const getNotifyName = (message: Message) => {
// 	// Yep, that works.
// 	return (message as any).data.notifyName as string;
// };

export const createMessageReveivedPayload = (message: Message): MessageReceived => {
	return {
		platform: 'WA',
		body: message.body,
		from: message.from,
		to: message.to,
		timestamp: message.timestamp,
		groupName: message.author,
		id: {
			...message.id,
			fromHostAccount: message.id.fromMe,
		},
	};
};
