import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import createBoundary from 'kozz-boundary-maker';
import Context, { setHostData } from 'src/Context';
import { createMessagePayload } from 'src/PayloadTransformers';

export const initSession = async (
	boundary: ReturnType<typeof createBoundary>
): Promise<Client> => {
	console.clear();
	console.log('Initializing WhatsApp Web client...');

	const client = new Client({
		authStrategy: new LocalAuth(),
		puppeteer: {
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		},
	});

	// QR Code generation
	client.on('qr', qr => {
		console.log('QR Code received, scan with WhatsApp:');
		qrcode.generate(qr, { small: true });
		boundary.emitForwardableEvent('kozz-iwac', 'qr_code');
		Context.upsert({ qr });
	});

	// Authentication
	client.on('authenticated', () => {
		console.log('Authenticated successfully!');
	});

	client.on('auth_failure', msg => {
		console.error('Authentication failure:', msg);
	});

	// Ready event
	client.on('ready', async () => {
		console.log('Client is ready!');

		const info = client.info;
		if (info) {
			setHostData(info.wid._serialized, info.pushname);
		}

		boundary.emitForwardableEvent('kozz-iwac', 'chat_ready');
		Context.upsert({ ready: true, qr: null });

		console.log('WhatsApp client ready and connected!');
	});

	// Message received
	client.on('message_create', async message => {
		try {
			console.log(`Processing message ${message.id._serialized}`);

			const payload = await createMessagePayload(message, client);

			if (payload.contact.isBlocked) {
				return;
			}

			// Emit to gateway
			boundary.emitMessage(payload);

			// Notify chat order change
			boundary.emitForwardableEvent('chat_order_move_to_top', payload.chatId);
		} catch (e) {
			console.warn('Error processing message:', e);
		}
	});

	// Disconnected
	client.on('disconnected', reason => {
		console.log('Client disconnected:', reason);
		Context.upsert({ ready: false, qr: null });
		boundary.emitForwardableEvent('kozz-iwac', 'reconnecting');
	});

	// Initialize client
	await client.initialize();

	return client;
};
