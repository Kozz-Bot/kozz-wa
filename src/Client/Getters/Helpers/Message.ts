import { Message, Client } from 'whatsapp-web.js';

export const getClientMessageById = async (whatsappBoundary: Client, id: string) => {
	try {
		const messageData: Message = await whatsappBoundary.pupPage!.evaluate(msgId => {
			// @ts-ignore
			const msg = window.Store.Msg.get(msgId);
			if (!msg) return null;
			//@ts-ignore
			return window.WWebJS.getMessageModel(msg);
		}, id);
		const myMessage = new Message(whatsappBoundary, messageData);
		return myMessage;
	} catch (e) {
		return null;
	}
};
