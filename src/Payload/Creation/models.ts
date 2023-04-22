import { ContactID, MessageID } from '../models';

type Base64 = string;

export type Media = {
	data: Base64;
	fileName: string | null;
	sizeInBytes: number | null;
	mimeType: string;
};

export type MessageReceived = {
	platform: 'WA';
	timestamp: number;
	from: ContactID;
	body: string;
	to: ContactID;
	id: MessageID;
	groupName?: string;
	media?: Media;
};
