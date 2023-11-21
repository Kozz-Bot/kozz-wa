import { Client } from 'whatsapp-web.js';
import { EditMessagePayload } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { getClientMessageById } from 'src/Client/Getters/Helpers/Message';
import { getClientMedia } from 'src/Client/Getters/Helpers/Media';

export const edit_message =
	(whatsappBoundary: Client, _: Socket) =>
		/**
		 * Reacts a message with an emote. If the emote string is empty, the reaction will be removed
		 * @param payload
		 * @returns
		 */
		async (payload: EditMessagePayload) => {
			const message = await getClientMessageById(whatsappBoundary, payload.messageId);
			if (payload.newContent.media) {
				const newId = await message?.edit(getClientMedia(payload.newContent.media), {
					extra: {
						caption: payload.newContent.body,
						quotedMessageId: payload.newContent.quotedMessageId,
					},
				});
				console.log(newId);
				console.log('id has changed?', newId?.id._serialized === payload.messageId);
			} else {
				const newId = await message?.edit(payload.newContent.body);
				console.log(newId);
				console.log('id has changed?', newId?.id._serialized === payload.messageId);
			}
		};
