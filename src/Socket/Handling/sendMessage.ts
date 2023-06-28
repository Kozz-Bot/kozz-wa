import { SendMessagePayload } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { Client } from 'whatsapp-web.js';

export const send_message =
	(whatsappBoundary: Client, _: Socket) => (payload: SendMessagePayload) => {
		whatsappBoundary.sendMessage(payload.chatId, payload.body);
	};
