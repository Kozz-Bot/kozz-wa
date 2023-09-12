import { Contact } from 'whatsapp-web.js';
import { ContactPayload } from 'kozz-types';

export const createContatcPayload = (contact: Contact): ContactPayload => {
	return {
		publicName: contact.pushname,
		privateName: contact.name || '',
		id: contact.id._serialized,
		isBlocked: contact.isBlocked,
		hostAdded: contact.isMyContact,
		isGroup: contact.isGroup,
	};
};
