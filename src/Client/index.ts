import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { onMessageReceived } from 'src/Socket/Emitting';
import { Socket } from 'socket.io-client';
import { runningOnWindows } from 'src/util/OS';
import { onUserJoinedGroup } from 'src/Socket/Emitting/groupEvents';

type WaSocket = Socket;

const chromePath = runningOnWindows()
	? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
	: '/usr/bin/google-chrome-stable';

const createBoundary = (socket: WaSocket) => {
	const whatsappBoundary = new Client({
		authStrategy: new LocalAuth(),
		puppeteer: {
			executablePath: chromePath,
			headless: false,
		},
		webVersionCache: {
			type: 'remote',
			remotePath:
				'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html',
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

	whatsappBoundary.on('group_join', onUserJoinedGroup(whatsappBoundary, socket));

	whatsappBoundary.on('group_leave', onUserJoinedGroup(whatsappBoundary, socket));

	// [TODO]: Make "host_metioned" a forwardable event.
	whatsappBoundary.on('message_create', async message => {});

	whatsappBoundary.on('message_create', async message => {
		onMessageReceived(socket, whatsappBoundary)(message);
	});

	return whatsappBoundary;
};

export default createBoundary;
