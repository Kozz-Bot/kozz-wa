import { SendMessagePayload } from 'kozz-types/dist';
import { getFormattedDateAndTime } from 'src/util/Time';
import { Client, MessageMedia } from 'whatsapp-web.js';

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
