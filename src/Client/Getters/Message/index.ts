import { AskResourcePayload } from 'kozz-types';
import { Client, Message } from 'whatsapp-web.js';

type RequestData = AskResourcePayload['request']['data'];

type IdQuery = {
	id: string;
};

export const getMessageById =
	(whatsappBoundary: Client) =>
	async ({ id }: RequestData) => {
		const newData = await whatsappBoundary.pupPage!.evaluate(msgId => {
			// @ts-ignore
			const msg = window.Store.Msg.get(msgId);
			if (!msg) return null;
			//@ts-ignore
			return window.WWebJS.getMessageModel(msg);
		}, id);

		// if (!newData) return null;
		console.log(newData);
	};
