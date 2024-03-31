import { SendMessagePayload } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { Client, MessageMedia } from 'whatsapp-web.js';
import fs from 'fs/promises';
import { parseAndProcessInlineCommands } from 'src/util/inlineCommandHandlers';

const __MAX_VIDEO_SIZE__ = 1024 * 1024 * 60; // 16 megabytes

export const send_message =
	(whatsappBoundary: Client, _: Socket) => (payload: SendMessagePayload) => {
		const { companion, stringValue } = parseAndProcessInlineCommands(payload.body);

		whatsappBoundary.sendMessage(payload.chatId, stringValue, {
			mentions: companion.mentions,
		});
	};

export const send_message_with_media =
	(whatsappBoundary: Client, _: Socket) => (payload: SendMessagePayload) => {
		const { companion, stringValue } = parseAndProcessInlineCommands(payload.body);

		if (!payload.media) {
			return console.warn(
				'[ERROR]: Evoked send_message_with_media with payload without media'
			);
		}

		let { data, fileName, mimeType, sizeInBytes } = payload.media;

		const tempFilePath = `./media/temp/${fileName || 'temp'}`;

		sizeInBytes = sizeInBytes || Buffer.from(data, 'base64').length;

		if (sizeInBytes > __MAX_VIDEO_SIZE__) {
			return whatsappBoundary.sendMessage(
				payload.chatId,
				'Error: Media file too large, max size 60 MB',
				{
					quotedMessageId: payload.quoteId,
				}
			);
		}

		try {
			whatsappBoundary.sendMessage(
				payload.chatId,
				new MessageMedia(mimeType, data, fileName, sizeInBytes),
				{
					quotedMessageId: payload.quoteId,
					caption: stringValue,
					mentions: companion.mentions,
				}
			);
		} catch (e) {
			fs.writeFile(tempFilePath, data, {
				encoding: 'base64',
			}).then(() => {
				whatsappBoundary.sendMessage(
					payload.chatId,
					MessageMedia.fromFilePath(tempFilePath),
					{
						quotedMessageId: payload.quoteId,
						caption: payload.body,
					}
				);
			});
		}
	};
