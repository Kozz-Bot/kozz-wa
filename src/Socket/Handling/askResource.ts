import { AskResourcePayload, ProvideResourcePayload } from 'kozz-types';
import { Socket } from 'socket.io-client';
import {
	getAllContacts,
	getContactById,
	getContactProfilePhoto,
	getMessageById,
} from 'src/Client/Getters';
import { Client } from 'whatsapp-web.js';

type RequestData = AskResourcePayload['request']['data'];

type GetterFn = (whatsappBoundary: Client) => (args: RequestData) => any;
type ResourceMap = Record<string, GetterFn>;

const resourceMap: ResourceMap = {
	all_contacts: getAllContacts,
	contact_by_id: getContactById,
	contact_profile_pic: getContactProfilePhoto,
	message_by_id: getMessageById,
};

export const ask_resource =
	(whatsappBoundary: Client, socket: Socket) =>
	async (payload: AskResourcePayload) => {
		const resourceToBeFound = payload.request.resource;
		const resourceGetterFn = resourceMap[resourceToBeFound];

		if (!resourceGetterFn) {
			return undefined;
		}

		const resource = await resourceGetterFn(whatsappBoundary)(payload.request.data);

		const responsePayload: ProvideResourcePayload = {
			...payload,
			response: resource,
			timestamp: new Date().getTime(),
		};
		socket.emit('reply_resource', responsePayload);
	};
