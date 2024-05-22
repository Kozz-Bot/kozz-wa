import { ForwardableUserLeftGroup, ForwardableUserJoinedGroup } from 'kozz-types';
import { GroupNotification } from 'whatsapp-web.js';
import { createContatcPayload } from './contact';

export const createUserJoinedGroupPayload = async (
	event: GroupNotification
): Promise<ForwardableUserJoinedGroup> => {
	const whoAdded = createContatcPayload(await event.getContact());
	const membersAdded = (await event.getRecipients()).map(contact =>
		createContatcPayload(contact)
	);

	return {
		chatId: event.chatId,
		membersAdded,
		whoAdded,
	};
};

export const createUserLeftGroupPayload = async (
	event: GroupNotification
): Promise<ForwardableUserLeftGroup> => {
	const WWebJsContact = await event.getContact();

	return {
		chatId: event.chatId,
		contact: createContatcPayload(WWebJsContact),
	};
};
