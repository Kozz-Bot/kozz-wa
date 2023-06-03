import { AskResourcePayload, ContactID } from 'kozz-types';
import { createContatcPayload } from 'src/Payload/Creation/contact';
import { Client } from 'whatsapp-web.js';

type RequestData = AskResourcePayload['request']['data'];

type IdQuery = {
	id: string;
};

export const getAllContacts = (whatsappBoundary: Client) => (_: RequestData) => {
	return whatsappBoundary
		.getContacts()
		.then(contactList => contactList.map(createContatcPayload));
};

export const getContactById = (whatsappBoundary: Client) => (args: RequestData) => {
	return whatsappBoundary
		.getContactById(args.id)
		.then(contact => createContatcPayload(contact));
};

export const getContactProfilePhoto =
	(whatsappBoundary: Client) => (args: RequestData) => {
		return whatsappBoundary
			.getContactById(args.id)
			.then(contact => contact.getProfilePicUrl());
	};
