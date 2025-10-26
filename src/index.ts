import dotenv from 'dotenv';
dotenv.config();

import { initSession } from './Client';
import { waFunctions } from './Client/WaFunctions';
import createBoundary from 'kozz-boundary-maker';
import { createFolderOnInit } from './util/utility';
import { createResourceGatherers } from './Resource';
import { CronJob } from 'cron';
import fs from 'fs/promises';
import { inlineCommandMapFunctions } from './Client/inlineCommandMap';
import { Client } from 'whatsapp-web.js';

let client: Client = {} as Client;

export const boundary = createBoundary({
	url: process.env.GATEWAY_URL || 'ws://localhost:4521',
	chatPlatform: 'Baileys',
	name: process.env.BOUNDARY_NAME || 'kozz-wa',
	inlineCommandMap: inlineCommandMapFunctions(client),
});

createFolderOnInit();

const deleteOldMedia = () => {
	fs.readdir('./medias').then(files => {
		files.forEach(file => {
			fs.stat(`./medias/${file}`).then(stats => {
				if (Date.now() - stats.birthtimeMs > 86400000) {
					fs.unlink(`./medias/${file}`);
				}
			});
		});
	});
};

initSession(boundary).then(waClient => {
	client = waClient;

	Object.assign(boundary, {
		...boundary,
		// Update the consume function with the new inline command map
	});

	const wa = waFunctions(waClient);

	// Set up cron job for cleaning old media
	CronJob.from({
		cronTime: '0 */10 * * * *',
		onTick: deleteOldMedia,
		start: true,
		timeZone: 'America/Sao_Paulo',
	});

	// Handle reply with text
	boundary.handleReplyWithText((payload, companion, body) => {
		wa.sendText(payload.chatId, body, payload.quoteId, companion.mentions);
	});

	// Handle reply with sticker
	boundary.handleReplyWithSticker(async (payload, companion, caption) => {
		if (!payload.media) {
			return console.warn('[ERROR]: reply_with_sticker called without media');
		}

		wa.sendMedia(
			payload.chatId,
			payload.media,
			{
				caption,
				mentionedList: companion.mentions,
				asSticker: true,
				contact: payload.contact,
				emojis: payload.media?.stickerTags,
			},
			payload.quoteId
		);
	});

	// Handle reply with media
	boundary.handleReplyWithMedia((payload, companion, caption) => {
		if (!payload.media) {
			return console.warn('[ERROR]: reply_with_media called without media');
		}

		wa.sendMedia(
			payload.chatId,
			payload.media,
			{
				caption,
				mentionedList: companion.mentions,
			},
			payload.quoteId
		);
	});

	// Handle send message
	boundary.handleSendMessage((payload, companion, body) => {
		wa.sendText(payload.chatId, body, undefined, companion.mentions);
	});

	// Handle send message with media
	boundary.handleSendMessageWithMedia((payload, companion, body) => {
		if (!payload.media) {
			return console.warn('[ERROR]: send_message_with_media called without media');
		}

		wa.sendMedia(
			payload.chatId,
			payload.media,
			{ caption: body, mentionedList: companion.mentions },
			payload.quoteId
		);
	});

	// Handle send message with sticker
	boundary.handleSendMessageWithSticker((payload, companion, body) => {
		if (!payload.media) {
			return console.warn('[ERROR]: send_message_with_sticker called without media');
		}

		wa.sendMedia(
			payload.chatId,
			payload.media,
			{
				caption: body,
				mentionedList: companion.mentions,
				asSticker: true,
				contact: payload.contact,
				emojis: payload.media?.stickerTags,
			},
			payload.quoteId
		);
	});

	// Handle react message
	boundary.handleReactMessage(async payload => {
		wa.reactMessage(payload.messageId, payload.emote);
	});

	// Handle delete message
	boundary.hanldeDeleteMessage(payload => {
		wa.deleteMessage(payload.messageId);
	});

	// Create resource gatherers
	createResourceGatherers(boundary, wa, waClient);

	console.log('Boundary handlers configured successfully!');
});
