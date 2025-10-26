import { Client, MessageMedia } from 'whatsapp-web.js';
import { Media, ContactPayload } from 'kozz-types';
import { getFormattedDateAndTime } from 'src/util/utility';
import { createMessageMedia } from 'src/util/media';

export const waFunctions = (client: Client) => {
	const sendText = async (
		chatId: string,
		text: string,
		quotedMessageId?: string,
		mentions?: string[]
	) => {
		const options: any = {};

		if (quotedMessageId) {
			try {
				await client.getMessageById(quotedMessageId);
				options.quotedMessageId = quotedMessageId;
			} catch (e) {
				console.warn('Quoted message not found:', quotedMessageId);
			}
		}

		if (mentions && mentions.length > 0) {
			options.mentions = mentions;
		}

		return client.sendMessage(chatId, text, options);
	};

	const sendMedia = async (
		chatId: string,
		media: Media,
		options: {
			viewOnce?: boolean;
			caption?: string;
			mentionedList?: string[];
			asSticker?: boolean;
			asVoiceNote?: boolean;
			contact?: ContactPayload;
			emojis?: string[];
		},
		quoteId?: string
	) => {
		const messageMedia = createMessageMedia(media);
		const sendOptions: any = {
			caption: options?.caption,
			mentions: options?.mentionedList || [],
		};

		if (quoteId) {
			try {
				await client.getMessageById(quoteId);
				sendOptions.quotedMessageId = quoteId;
			} catch (e) {
				console.warn('Quoted message not found:', quoteId);
			}
		}

		if (options?.asSticker) {
			const stickerOptions: any = {
				...sendOptions,
				sendMediaAsSticker: true,
			};

			if (options?.contact) {
				stickerOptions.stickerName = [
					'Criado por',
					options.contact.publicName,
					getFormattedDateAndTime(),
					options?.emojis?.[0] || '',
				].join('\n');
				stickerOptions.stickerAuthor = 'Kozz-Bot\ndo Tramonta';
			}

			if (options?.emojis && options.emojis.length > 0) {
				stickerOptions.stickerCategories = options.emojis;
			}

			return client.sendMessage(chatId, messageMedia, stickerOptions);
		}

		if (options?.asVoiceNote && media.mimeType.startsWith('audio')) {
			sendOptions.sendAudioAsVoice = true;
		}

		return client.sendMessage(chatId, messageMedia, sendOptions);
	};

	const reactMessage = async (messageId: string, emoji: string) => {
		if (!messageId) {
			console.warn('Message ID is undefined');
			return;
		}

		try {
			const message = await client.getMessageById(messageId);
			if (!message) {
				return;
			}
			return await message.react(emoji);
		} catch (e) {
			console.warn('Error reacting to message:', e);
		}
	};

	const deleteMessage = async (messageId: string) => {
		if (!messageId) {
			console.warn('Message ID is undefined');
			return;
		}

		try {
			const message = await client.getMessageById(messageId);
			if (!message) {
				return;
			}
			return await message.delete(true);
		} catch (e) {
			console.warn('Error deleting message:', e);
		}
	};

	const getProfilePic = async (contactId: string) => {
		if (!contactId) {
			console.warn('Contact ID is undefined');
			return undefined;
		}

		try {
			const contact = await client.getContactById(contactId);
			if (!contact) {
				return undefined;
			}
			const profilePicUrl = await contact.getProfilePicUrl();
			return profilePicUrl;
		} catch (e) {
			console.warn('Error getting profile pic:', e);
			return undefined;
		}
	};

	return {
		sendText,
		sendMedia,
		reactMessage,
		deleteMessage,
		getProfilePic,
	};
};
