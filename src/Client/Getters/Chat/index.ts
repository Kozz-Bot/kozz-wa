import {
	AskResourcePayload,
	ChatData,
	ContactID,
	GroupChatData,
	PrivateChatData,
} from 'kozz-types';
import { createContatcPayload } from 'src/Payload/Creation/contact';
import { Chat, Client, GroupChat, PrivateChat } from 'whatsapp-web.js';

type RequestData = AskResourcePayload['request']['data'];

export const getChatInfo =
	(whatsappBoundary: Client) =>
	async ({ id }: RequestData) => {
		try {
			const chatData = await whatsappBoundary.getChatById(id);
			if (isGroup(chatData)) {
				return getGroupData(chatData, whatsappBoundary);
			} else {
				return getPrivateChatData(id, whatsappBoundary);
			}
		} catch (e) {
			console.warn(e);
		}
	};

export const getGroupData = async (
	chatData: GroupChat,
	whatsappBoundary: Client
): Promise<GroupChatData> => {
	const allAdminsContacts = await Promise.all(
		chatData.participants
			.filter(p => p.isAdmin || p.isSuperAdmin)
			.map(admin => admin.id)
			.map(id =>
				whatsappBoundary
					.getContactById(id._serialized)
					.then(contact => createContatcPayload(contact))
			)
	);

	const allParticipantsContacts = await Promise.all(
		chatData.participants
			.filter(p => p.isAdmin || !p.isSuperAdmin)
			.map(member => member.id)
			.map(id =>
				whatsappBoundary
					.getContactById(id._serialized)
					.then(contact => createContatcPayload(contact))
			)
	);

	return {
		adminList: allAdminsContacts,
		membersList: allParticipantsContacts,
		description: chatData.description,
		id: chatData.id._serialized,
		name: chatData.name,
		isGroup: true,
	};
};

export const getPrivateChatData = async (
	chatId: string,
	whatsappBoundary: Client
): Promise<PrivateChatData> => {
	const contact = await whatsappBoundary.getContactById(chatId);
	return {
		...createContatcPayload(contact),
		isGroup: false,
	};
};

const isGroup = (chatData: GroupChat | PrivateChat): chatData is GroupChat => {
	return chatData.isGroup;
};
