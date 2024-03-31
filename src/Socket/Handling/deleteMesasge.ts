import { Socket } from 'socket.io-client';
import { Client } from 'whatsapp-web.js';
import { DeleteMessagePayload } from 'kozz-types';
import { getClientMessageById } from 'src/Client/Getters/Helpers/Message';

export const delete_message =
	(whatsappBoundary: Client, _: Socket) => async (payload: DeleteMessagePayload) => {
		const message = await getClientMessageById(whatsappBoundary, payload.messageId);
		if (!message) {
			return console.warn(
				`Tried to delete message with id ${payload.messageId} but this message could not be found`
			);
		}
		await message.delete(!payload.localDelete);
	};
