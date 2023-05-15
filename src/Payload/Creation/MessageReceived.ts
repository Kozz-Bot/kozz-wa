import { Message } from 'whatsapp-web.js';
import { MessageReceived, MessageType } from 'kozz-types';
import { createContatcPayload } from './contact';

const typeMap: Partial<{
	[key in Message['type']]: MessageType;
}> = {
	audio: 'AUDIO',
	chat: 'TEXT',
	image: 'IMAGE',
	video: 'VIDEO',
	sticker: 'STICKER',
};

export const createMessageReveivedPayload = async (
	message?: Message
): Promise<MessageReceived | undefined> => {
	if (!message) return undefined;

	const quotedMessage = await message.getQuotedMessage();

	const getMessageType = (message: Message) => typeMap[message.type] || 'OTHER';

	return {
		platform: 'WA',
		body: message.body.toLowerCase(),
		from: message.from,
		to: message.to,
		timestamp: message.timestamp * 1000 || new Date().getTime(),
		groupName: message.author,
		fromHostAccount: message.fromMe,
		id: message.id._serialized,
		media: await createMediaReceivedPayload(message),
		boundaryId: process.env.BOUNDARY_ID as string,
		quotedMessage: await createMessageReveivedPayload(quotedMessage),
		contact: createContatcPayload(await message.getContact()),
		messageType: getMessageType(message),
		// the lib does not type the raw data
		isViewOnce: ((message.rawData as any).isViewOnce as boolean) || false,
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
