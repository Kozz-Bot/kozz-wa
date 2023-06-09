import { SendMessagePayload } from 'kozz-types/dist';
import { getFormattedDateAndTime } from 'src/util/Time';
import { Client, MessageMedia } from 'whatsapp-web.js';
import fs from 'fs/promises';
import { Socket } from 'socket.io-client';

/**
 * Reply a given message with plain text
 * @param whatsappBoundary
 * @returns
 */
export const reply_with_text =
	(whatsappBoundary: Client, _: Socket) => (payload: SendMessagePayload) => {
		console.log('got reply with text');
		whatsappBoundary.sendMessage(payload.chatId, payload.body, {
			quotedMessageId: payload.quoteId,
		});
	};

export const reply_with_sticker =
	(whatsappBoundary: Client, _: Socket) => (payload: SendMessagePayload) => {
		console.log('requesting reply with sticker');
		if (!payload.media) {
			return console.warn(
				'[ERROR]: Evoked replyWithSticker with payload without media'
			);
		}
		const { data, fileName, mimeType, sizeInBytes } = payload.media;

		whatsappBoundary.sendMessage(
			payload.chatId,
			new MessageMedia(mimeType, data, fileName, sizeInBytes),
			{
				sendMediaAsSticker: true,
				quotedMessageId: payload.quoteId,
				stickerName: [
					'Criado por',
					`${payload.contact.publicName}`,
					`${getFormattedDateAndTime()}`,
				].join('\n'),
				stickerAuthor: 'Kozz-Bot\ndo Tramonta',
				stickerCategories: ['🥴'],
			}
		);
	};

const __MAX_VIDEO_SIZE__ = 1024 * 1024 * 16; // 16 megabytes

export const reply_with_media =
	(whatsappBoundary: Client, _: Socket) => (payload: SendMessagePayload) => {
		console.log('requesting reply with media');

		if (!payload.media) {
			return console.warn(
				'[ERROR]: Evoked reply_with_media with payload without media'
			);
		}

		let { data, fileName, mimeType, sizeInBytes } = payload.media;

		const tempFilePath = `./media/temp/${fileName || 'temp'}`;

		sizeInBytes = sizeInBytes || Buffer.from(data, 'base64').length;

		if (sizeInBytes > __MAX_VIDEO_SIZE__) {
			return whatsappBoundary.sendMessage(
				payload.chatId,
				'Error: Media file too large, max size 16 MB',
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
					caption: payload.body,
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
