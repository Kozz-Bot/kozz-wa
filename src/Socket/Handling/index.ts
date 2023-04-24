import { SendMessagePayload } from 'kozz-types/dist';
import { Client } from 'whatsapp-web.js';

export const replyWithText =
	(whatsappBoundary: Client) => (payload: SendMessagePayload) => {
		whatsappBoundary.sendMessage(payload.chatId, payload.body, {
			quotedMessageId: payload.quoteId,
		});
	};
