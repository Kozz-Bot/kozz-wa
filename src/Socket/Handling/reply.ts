import { SendMessagePayload } from 'kozz-types/dist';
import { getFormattedDateAndTime } from 'src/util/Time';
import { Client, MessageMedia } from 'whatsapp-web.js';
import fs from 'fs/promises';
import { Socket } from 'socket.io-client';
import { parseAndProcessInlineCommands } from 'src/Socket/Handling/InlineCommands/inlineCommandHandlers';

/**
 * Reply a given message with plain text
 * @param whatsappBoundary
 * @returns
 */
export const reply_with_text =
	(whatsappBoundary: Client, _: Socket) => async (payload: SendMessagePayload) => {
		const { companion, stringValue } = await parseAndProcessInlineCommands(
			payload.body,
			whatsappBoundary,
			payload
		);

		whatsappBoundary.sendMessage(payload.chatId, stringValue, {
			quotedMessageId: payload.quoteId,
			mentions: companion.mentions,
		});
	};

export const reply_with_sticker =
	(whatsappBoundary: Client, _: Socket) => (payload: SendMessagePayload) => {
		if (!payload.media) {
			return console.warn(
				'[ERROR]: Evoked replyWithSticker with payload without media'
			);
		}
		const { data, fileName, mimeType, sizeInBytes, stickerTags } = payload.media;

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
				stickerCategories: stickerTags,
			}
		);
	};

const __MAX_VIDEO_SIZE__ = 1024 * 1024 * 60; // 16 megabytes

export const reply_with_media =
	(whatsappBoundary: Client, _: Socket) => async (payload: SendMessagePayload) => {
		const { companion, stringValue } = await parseAndProcessInlineCommands(
			payload.body,
			whatsappBoundary,
			payload
		);

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
				'Error: Media file too large, max size 60 MB',
				{
					quotedMessageId: payload.quoteId,
				}
			);
		}

		/**
		 * Creating proper instance for media whether its from b64 or url;
		 */
		const messageMedia =
			payload.media.transportType === 'b64'
				? new MessageMedia(mimeType, data, fileName, sizeInBytes)
				: await MessageMedia.fromUrl(payload.media.data, {
						unsafeMime: true,
				  });

		try {
			whatsappBoundary.sendMessage(payload.chatId, messageMedia, {
				quotedMessageId: payload.quoteId,
				caption: stringValue,
				mentions: companion.mentions,
			});
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
