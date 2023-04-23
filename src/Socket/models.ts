import { Media } from 'src/Payload/Creation/models';

export type SendMessagePayload = {
	quoteId?: string;
	chatId: string;
	body: string;
	media?: Media;
	platform: 'WA';
	timestamp: number;
};
