import { Message } from 'whatsapp-web.js';
import { MessageReceived } from 'kozz-types';

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
		fromHostAccount: message.fromMe,
		id: message.id._serialized,
		media: await createMediaReceivedPayload(message),
	};
};

export const createMediaReceivedPayload = async (message: Message) => {
	try {
		if (message.hasMedia) {
			const messageMedia = await message.downloadMedia();

			return {
				data: messageMedia.data,
				mimeType: messageMedia.mimetype,
				fileName: messageMedia.filename || null,
				sizeInBytes: messageMedia.filesize || null,
			};
		}
	} catch (e) {
		console.warn(`[ERROR ON MESSAGE ${message.from}]`);
	}
};
