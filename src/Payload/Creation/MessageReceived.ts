import { Client, Message } from 'whatsapp-web.js';
import { Media, MessageReceived, MessageType } from 'kozz-types';
import { createContatcPayload } from './contact';
import { getContactById } from 'src/Client/Getters';

const typeMap: Partial<{
	[key in Message['type']]: MessageType;
}> = {
	audio: 'AUDIO',
	chat: 'TEXT',
	image: 'IMAGE',
	video: 'VIDEO',
	sticker: 'STICKER',
};

export const createMessageReceivedPayload = async (
	message: Message | undefined,
	whatsappBoundary: Client
): Promise<MessageReceived | undefined> => {
	if (!message) return undefined;

	const quotedMessage = await message.getQuotedMessage();

	const getMessageType = (message: Message) => typeMap[message.type] || 'OTHER';
	const chat = await message.getChat();

	const taggedContacts = message.body.match(/@[0-9]{8,18}/g);

	const createTaggedContactPayload = (id: string) => {
		return getContactById(whatsappBoundary)({
			id: `${id.replace('@', '')}@c.us`,
		});
	};

	return {
		platform: 'WA',
		body: message.body.toLowerCase(),
		from: createContatcPayload(await message.getContact()).id,
		to: message.fromMe ? chat.id._serialized : message.from,
		timestamp: message.timestamp * 1000 || new Date().getTime(),
		groupName: chat.isGroup ? chat.name : undefined,
		fromHostAccount: message.fromMe,
		id: message.id._serialized,
		media: await createMediaReceivedPayload(message),
		boundaryName: process.env.BOUNDARY_ID as string,
		quotedMessage: await createMessageReceivedPayload(
			quotedMessage,
			whatsappBoundary
		),
		contact: createContatcPayload(await message.getContact()),
		messageType: getMessageType(message),
		// the lib does not type the raw data
		isViewOnce: ((message.rawData as any).isViewOnce as boolean) || false,
		taggedContacts: await Promise.all(
			taggedContacts?.map(tag => createTaggedContactPayload(tag)) || []
		),
	};
};

export const createMediaReceivedPayload = async (
	message: Message
): Promise<Media | undefined> => {
	try {
		if (message.hasMedia) {
			const messageMedia = await message.downloadMedia();

			return {
				data: messageMedia.data,
				mimeType: messageMedia.mimetype,
				fileName: messageMedia.filename || null,
				sizeInBytes: messageMedia.filesize || null,
				transportType: 'b64',
			};
		}
	} catch (e) {
		console.warn(`[ERROR ON MESSAGE ${message.from}]`);
	}
};
