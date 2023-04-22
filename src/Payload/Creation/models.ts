import { ContactID, MessageID } from '../models';

export type MessageReceived = {
	platform: 'WA';
	timestamp: number;
	from: ContactID;
	body: string;
	to: ContactID;
	id: MessageID;

	groupName?: string;
};
