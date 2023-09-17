import {
	Client,
	LocalAuth,
	Message,
	MessageContent,
	MessageEditOptions,
} from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { onMessageReceived } from 'src/Payload/Creation';
import { Socket } from 'socket.io-client';
import { runningOnWindows } from 'src/util/OS';

type WaSocket = Socket;

const chromePath = runningOnWindows()
	? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
	: '/usr/bin/google-chrome-stable';

const createBoundary = (socket: WaSocket) => {
	const whatsappBoundary = new Client({
		authStrategy: new LocalAuth(),
		puppeteer: {
			executablePath: chromePath,
			headless: true,
		},
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

	whatsappBoundary.on('loading_screen', (percent, message) =>
		console.log({
			percent,
			message,
		})
	);

	whatsappBoundary.on('message_create', async message => {
		onMessageReceived(socket, whatsappBoundary)(message);

		// Message edits just refuse to work with my account and i'm not sure why.
		if (message.body === '!edit') {
			const sleep = (time: number) =>
				new Promise(resolve => setTimeout(resolve, time));

			await sleep(5000);

			const quotedMessage = await message.getQuotedMessage();

			const edit = await quotedMessage.edit('Editado');
			console.log({ edit });
		}
	});

	// @ts-ignore
	return whatsappBoundary;
};

export default createBoundary;
