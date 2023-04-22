import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { onMessageReceived } from 'src/Payload/Creation';

const createBoundary = () => {
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

	return whatsappBoundary;
};

export default createBoundary;
