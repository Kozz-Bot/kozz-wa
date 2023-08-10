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

	whatsappBoundary.on('message_create', onMessageReceived(socket));

	// @ts-ignore
	whatsappBoundary.on('message_create', async message => {
		if (message.body === '!edit') {
			const sleep = (time: number) =>
				new Promise(resolve => setTimeout(resolve, time));

			await sleep(5000);

			const canEdit = await whatsappBoundary.pupPage!.evaluate(async msgId => {
				// @ts-ignore
				let msg = window.Store.Msg.get(msgId);
				if (!msg) return false;
				// @ts-ignore
				return await window.Store.MsgActionChecks.canEditText(msgId);
				// @ts-ignore
			}, message.id._serialized);

			console.log(canEdit);

			message.getQuotedMessage().then(msg => msg.edit('Editado'));
		}
	});

	return whatsappBoundary;
};

export default createBoundary;
