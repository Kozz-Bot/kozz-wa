import { Message, MessageMedia } from 'whatsapp-web.js';
import { Media } from 'kozz-types';

export const downloadMediaFromMessage = async (
	message: Message
): Promise<Media | undefined> => {
	if (!message.hasMedia) {
		return undefined;
	}

	try {
		const media = await message.downloadMedia();

		if (!media) {
			return undefined;
		}

		return {
			data: media.data,
			fileName: media.filename || null,
			mimeType: media.mimetype,
			sizeInBytes: null,
			transportType: 'b64',
			stickerTags: undefined,
			duration: null,
		};
	} catch (e) {
		console.warn('Error downloading media:', e);
		return undefined;
	}
};

export const createMessageMedia = (media: Media): MessageMedia => {
	return new MessageMedia(media.mimeType, media.data, media.fileName || undefined);
};
