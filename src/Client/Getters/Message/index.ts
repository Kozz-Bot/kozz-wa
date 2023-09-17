import { AskResourcePayload } from 'kozz-types';
import { createMessageReceivedPayload } from 'src/Payload/Creation/MessageReceived';
import { Client, Message } from 'whatsapp-web.js';
import { getClientMessageById } from '../Helpers/Message';

type RequestData = AskResourcePayload['request']['data'];

export const getMessageById =
	(whatsappBoundary: Client) =>
	async ({ id }: RequestData) => {
		const myMessage = await getClientMessageById(whatsappBoundary, id);
		if (!myMessage) return null;
		return createMessageReceivedPayload(myMessage, whatsappBoundary);
	};
