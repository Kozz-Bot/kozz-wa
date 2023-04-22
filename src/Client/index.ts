import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { onMessageReceived } from 'src/Payload/Creation';
import { WhatsAppEvents } from './models';

const createBoundary = (events: WhatsAppEvents) => {
	const whatsappBoundary = new Client({
		authStrategy: new LocalAuth(),
	});

	whatsappBoundary.on('qr', qr => {
		qrcode.generate(qr, { small: true });
	});

	whatsappBoundary.on('ready', () => {
		console.log('[SERVIDOR]: Cliente pronto');
	});

	whatsappBoundary.on('message_create', onMessageReceived);

	/**
	 * This is not statically typed. But it is when I've defined
	 * the handlers, so it should not be a big problem.
	 */
	Object.entries(events).forEach(([eventName, eventHandler]) => {
		whatsappBoundary.on(eventName, eventHandler);
	});

	return whatsappBoundary;
};

export default createBoundary;
