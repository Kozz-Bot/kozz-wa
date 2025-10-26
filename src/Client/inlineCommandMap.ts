import {
	CompanionObject,
	InlineCommandMap,
	StyleVariant,
} from 'kozz-boundary-maker/dist/InlineCommand';
import { Client } from 'whatsapp-web.js';
import { getMarkdownFor } from './markdown';

export const inlineCommandMapFunctions = (
	client: Client
): Partial<InlineCommandMap> => {
	const mention = async (
		companion: CompanionObject,
		data: { id: string },
		payload: any
	) => {
		return {
			companion: {
				mentions: [...companion.mentions, data.id],
			},
			stringValue: '@' + data.id.replace('@s.whatsapp.net', ''),
		};
	};

	const invisiblemention = async (
		companion: CompanionObject,
		data: { id: string },
		payload: any
	) => {
		return {
			companion: {
				mentions: [...companion.mentions, data.id],
			},
			stringValue: '',
		};
	};

	const tageveryone = async (
		companion: CompanionObject,
		data: { except: string[] },
		payload: any
	) => {
		let mentions: string[] = [];

		try {
			const chatInfo = await client.getChatById(payload.chatId);

			if (chatInfo && chatInfo.isGroup) {
				const chat = chatInfo as any;
				mentions = chat.participants
					.map((member: any) => member.id._serialized)
					.filter((member: string) => !data.except.includes(member));
			}
		} catch (e) {
			console.warn('Error in tageveryone:', e);
		}

		return {
			companion: {
				mentions: [...companion.mentions, ...mentions],
			},
			stringValue: '',
		};
	};

	const begin_style = async (
		companion: CompanionObject,
		data: { variant: StyleVariant },
		payload: any
	) => {
		const stringValue = getMarkdownFor(data.variant, 'begin');

		return {
			companion: {
				mentions: [...companion.mentions],
			},
			stringValue,
		};
	};

	const end_style = async (
		companion: CompanionObject,
		data: { variant: StyleVariant },
		payload: any
	) => {
		const stringValue = getMarkdownFor(data.variant, 'end');

		return {
			companion: {
				mentions: [...companion.mentions],
			},
			stringValue,
		};
	};

	return {
		mention,
		invisiblemention,
		tageveryone,
		begin_style,
		end_style,
	};
};
