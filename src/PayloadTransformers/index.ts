import {
	Message,
	Contact,
	GroupChat as WWJSGroupChat,
	Client,
} from 'whatsapp-web.js';
import { ContactPayload, GroupChat, MessageReceived } from 'kozz-types';
import Context from 'src/Context';
import { clearContact, replaceTaggedName } from 'src/util/utility';
import { downloadMediaFromMessage } from 'src/util/media';

type Participant =
	| string
	| {
			server: 'lid';
			user: string;
			_serialized: string;
	  };

export const getParticipant = (participant: Participant) => {
	if (typeof participant === 'string') {
		return participant;
	} else {
		return participant._serialized;
	}
};

export const createContactPayload = async (
	message: Message,
	client: Client
): Promise<ContactPayload> => {
	const contact = await client.getContactById(
		// @ts-ignore participant is not on the typing of message ID
		message.id.participant
			? // @ts-ignore participant is not on the typing of message ID
			  getParticipant(message.id.participant)
			: message.author || message.from || message.id._serialized
	);

	const contactId = clearContact(contact.id._serialized);
	const isBlocked = contact.isBlocked || false;

	return {
		hostAdded: false,
		id: contactId,
		isHostAccount: message.fromMe,
		isBlocked,
		publicName: contact.pushname || contact.name || '',
		isGroup: message.from.includes('@g.us'),
		privateName: contact.name || '',
	};
};

export const createContactFromWWJS = async (
	contact: Contact
): Promise<ContactPayload> => {
	const hostData = Context.get('hostData');
	const contactId = clearContact(contact.id._serialized);
	const isBlocked = contact.isBlocked || false;

	return {
		hostAdded: false,
		id: contactId,
		isHostAccount: hostData.id === contactId,
		isBlocked,
		publicName: contact.pushname || contact.name || '',
		isGroup: contact.isGroup,
		privateName: contact.name || '',
	};
};

export const createTaggedContactPayload = async (
	message: Message
): Promise<ContactPayload[]> => {
	const contacts: ContactPayload[] = [];
	const mentions = await message.getMentions();

	for (const mention of mentions) {
		const newContact = await createContactFromWWJS(mention);
		contacts.push(newContact);
	}

	return contacts;
};

export const createMessagePayload = async (
	message: Message,
	client: Client
): Promise<MessageReceived> => {
	const media = await downloadMediaFromMessage(message);
	const contact = await createContactPayload(message, client);
	const taggedContact = await createTaggedContactPayload(message);
	const chat = await message.getChat();

	const messageBody = message.body || '';

	let taggedContactFriendlyBody = messageBody;
	if (taggedContact.length) {
		taggedContactFriendlyBody = replaceTaggedName(messageBody, taggedContact);
	}

	const messageType = message.hasMedia
		? message.type === 'audio'
			? 'AUDIO'
			: message.type === 'sticker'
			? 'STICKER'
			: message.type === 'video'
			? 'VIDEO'
			: message.type === 'image'
			? 'IMAGE'
			: 'TEXT'
		: 'TEXT';

	let quotedMessage: MessageReceived | undefined = undefined;

	if (message.hasQuotedMsg) {
		try {
			const quoted = await message.getQuotedMessage();
			const quotedMedia = await downloadMediaFromMessage(quoted);
			const quotedContact = await createContactPayload(quoted, client);
			const quotedTaggedContact = await createTaggedContactPayload(quoted);

			const quotedBody = quoted.body || '';
			let quotedTaggedFriendlyBody = quotedBody;
			if (quotedTaggedContact.length) {
				quotedTaggedFriendlyBody = replaceTaggedName(
					quotedBody,
					quotedTaggedContact
				);
			}

			const quotedType = quoted.hasMedia
				? quoted.type === 'audio'
					? 'AUDIO'
					: quoted.type === 'sticker'
					? 'STICKER'
					: quoted.type === 'video'
					? 'VIDEO'
					: quoted.type === 'image'
					? 'IMAGE'
					: 'TEXT'
				: 'TEXT';

			quotedMessage = {
				body: quotedBody,
				boundaryName: process.env.BOUNDARY_NAME ?? '',
				id: quoted.id._serialized,
				contact: quotedContact,
				from: quotedContact.id,
				fromHostAccount: quotedContact.isHostAccount,
				isViewOnce: false,
				to: chat.id._serialized,
				chatId: chat.id._serialized,
				messageType: quotedType,
				platform: 'Baileys',
				quotedMessage: undefined,
				santizedBody: quotedBody
					.toLowerCase()
					.normalize('NFKD')
					.replace(/[\u0300-\u036f]/g, ''),
				taggedContacts: quotedTaggedContact,
				timestamp: quoted.timestamp,
				taggedConctactFriendlyBody: quotedTaggedFriendlyBody,
				media: quotedMedia,
			};
		} catch (e) {
			console.warn('Error fetching quoted message:', e);
		}
	}

	const chatId = chat.id._serialized;

	return {
		body: messageBody,
		boundaryName: process.env.BOUNDARY_NAME ?? '',
		id: message.id._serialized,
		contact,
		from: contact.id,
		fromHostAccount: contact.isHostAccount,
		isViewOnce: false,
		to: chatId,
		chatId,
		messageType,
		platform: 'Baileys',
		quotedMessage,
		santizedBody: messageBody
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, ''),
		taggedContacts: taggedContact,
		timestamp: message.timestamp * 1000,
		taggedConctactFriendlyBody: taggedContactFriendlyBody,
		media,
	};
};

export const createGroupChatPayload = (
	chat: WWJSGroupChat
): GroupChat | undefined => {
	if (!chat.isGroup) {
		return undefined;
	}

	return {
		id: chat.id._serialized,
		community: null,
		description: chat.description || '',
		memberCount: chat.participants.length,
		name: chat.name,
		owner: chat.owner?._serialized || 'NOT_FOUND',
		participants: chat.participants.map(participant => ({
			admin: participant.isAdmin || participant.isSuperAdmin,
			id: clearContact(participant.id._serialized),
		})),
		unreadCount: chat.unreadCount || 0,
	};
};
