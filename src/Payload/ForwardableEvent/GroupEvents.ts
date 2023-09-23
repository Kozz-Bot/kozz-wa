import { UserJoinedGroupChat, UserLeftGroupChat } from 'kozz-types';
import { GroupNotification } from 'whatsapp-web.js';
import { createContatcPayload } from '../Creation/contact';

export const createUserJoinedGroupPayload = async (
	event: GroupNotification
): Promise<UserJoinedGroupChat> => {
	const WWebJsContact = await event.getContact();

	return {
		chatId: event.chatId,
		contact: createContatcPayload(WWebJsContact),
	};
};

export const createUserLeftGroupPayload = async (
	event: GroupNotification
): Promise<UserLeftGroupChat> => {
	const WWebJsContact = await event.getContact();

	return {
		chatId: event.chatId,
		contact: createContatcPayload(WWebJsContact),
	};
};
