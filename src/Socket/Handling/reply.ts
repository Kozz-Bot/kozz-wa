import { SendMessagePayload } from 'kozz-types/dist';
import { getFormattedDateAndTime } from 'src/util/Time';
import { Client, MessageMedia } from 'whatsapp-web.js';

/**
 * Reply a given message with plain text
 * @param whatsappBoundary
 * @returns
 */
export const reply_with_text =
	(whatsappBoundary: Client) => (payload: SendMessagePayload) => {
		console.log('got reply with text');
		whatsappBoundary.sendMessage(payload.chatId, payload.body, {
			quotedMessageId: payload.quoteId,
		});
	};

export const reply_with_sticker =
	(whatsappBoundary: Client) => (payload: SendMessagePayload) => {
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

export const reply_with_media =
	(whatsappBoundary: Client) => (payload: SendMessagePayload) => {
		console.log('requesting reply with media');

		if (!payload.media) {
			return console.warn(
				'[ERROR]: Evoked reply_with_media with payload without media'
			);
		}

		const { data, fileName, mimeType, sizeInBytes } = payload.media;

		whatsappBoundary.sendMessage(
			payload.chatId,
			new MessageMedia(mimeType, data, fileName, sizeInBytes),
			{
				quotedMessageId: payload.quoteId,
				caption: payload.body,
			}
		);
	};
