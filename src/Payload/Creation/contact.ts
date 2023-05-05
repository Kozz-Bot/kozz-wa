import { Contact } from 'whatsapp-web.js';
import { ContactPayload } from 'kozz-types';

export const createContatcPayload = (contact: Contact): ContactPayload => {
	return {
		/**
		 * Name the contact choose to display publicly
		 */
		publicName: contact.pushname,
		/**
		 * Name the host user give to the contact
		 */
		privateName: contact.name || 'no-name',
		id: contact.id._serialized,
		isBlocked: contact.isBlocked,
		/**
		 * If the host account has added the contact
		 */
		hostAdded: contact.isMyContact,
	};
};
