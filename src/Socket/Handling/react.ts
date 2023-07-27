import { Client } from 'whatsapp-web.js';
import { ReactToMessagePayload } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { getClientMessageById } from 'src/Client/Getters/Helpers/Message';

export const react_message =
	(whatsappBoundary: Client, _: Socket) =>
	/**
	 * Reacts a message with an emote. If the emote string is empty, the reaction will be removed
	 * @param payload
	 * @returns
	 */
	async (payload: ReactToMessagePayload) => {
		const message = await getClientMessageById(whatsappBoundary, payload.messageId);
		return message?.react(payload.emote);
	};
