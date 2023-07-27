import { Media } from 'kozz-types';
import { MessageMedia } from 'whatsapp-web.js';

export const getClientMedia = (media: Media) => {
	const { data, fileName, mimeType, sizeInBytes } = media;
	return new MessageMedia(mimeType, data, fileName, sizeInBytes);
};
