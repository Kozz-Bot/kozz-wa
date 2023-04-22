import WAWebJS, { Message } from 'whatsapp-web.js';
import { MessageReceived } from './models';

// const getNotifyName = (message: Message) => {
// 	// Yep, that works.
// 	return (message as any).data.notifyName as string;
// };

export const createMessageReveivedPayload = async (
	message: Message
): Promise<MessageReceived> => {
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
		media: await createMediaReceivedPayload(message),
	};
};

export const createMediaReceivedPayload = async (message: Message) => {
	if (message.hasMedia) {
		const messageMedia = await message.downloadMedia();

		return {
			data: messageMedia.data,
			mimeType: messageMedia.mimetype,
			fileName: messageMedia.filename || null,
			sizeInBytes: messageMedia.filesize || null,
		};
	}
};
