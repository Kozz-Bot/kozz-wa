import { Client } from 'whatsapp-web.js';
import { ReactToMessagePayload } from 'kozz-types';
import { Socket } from 'socket.io-client';

/**
 * [TODO]:
 * It's not working. I need to figure out how to get the message object with
 * the client. Maybe cache it?
 * @param whatsappBoundary
 * @returns
 */
export const react_message =
	(whatsappBoundary: Client, _: Socket) =>
	async (payload: ReactToMessagePayload) => {
		const messages = await whatsappBoundary.searchMessages(payload.messageId, {
			chatId: payload.chatId,
			limit: 1,
			page: 1,
		});

		if (messages.length === 0) return;
		messages[0].react(payload.emote);
	};
