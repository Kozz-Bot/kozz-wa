export type MessageID = {
	fromMe: boolean;
	remote: ContactID;
	id: string;
};

export type ContactID = string;
