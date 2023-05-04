import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { onMessageReceived } from 'src/Payload/Creation';
import { Socket } from 'socket.io-client';

type WaSocket = Socket;

const createBoundary = (socket: WaSocket) => {
	const whatsappBoundary = new Client({
		authStrategy: new LocalAuth(),
	});

	whatsappBoundary.on('qr', qr => {
		qrcode.generate(qr, { small: true });
	});

	whatsappBoundary.on('ready', () => {
		console.log('[SERVIDOR]: Cliente pronto');
	});

	whatsappBoundary.on('change_state', state => {
		console.log(state);
	});

	whatsappBoundary.on('auth_failure', message => console.log(message));

	whatsappBoundary.on('loading_screen', (percent, message) => ({
		percent,
		message,
	}));

	whatsappBoundary.on('message_create', onMessageReceived(socket));

	console.log('Starting server');

	return whatsappBoundary;
};

export default createBoundary;
