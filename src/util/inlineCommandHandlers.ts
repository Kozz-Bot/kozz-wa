import { Client } from 'whatsapp-web.js';
import { Command, parseMessageBody, PlainText } from './inlineCommandParser';
import { SendMessagePayload } from 'kozz-types';
import { getChatInfo, getGroupData } from 'src/Client/Getters/Chat';

type CompanionObject = {
	mentions: string[];
};

type CommandArgs = {
	mention: { id: string };
	invisiblemention: { id: string };
	tageveryone: {};
};

type InlineCommandHandler<T extends Record<string, any>> = (
	companion: CompanionObject,
	data: Command<any, T>['commandData'],
	client: Client,
	payload: SendMessagePayload
) => Promise<{
	companion: CompanionObject;
	/**
	 * This string will substitute the inline command payload
	 */
	stringValue: string;
}>;

type CommandMap = {
	[key in keyof CommandArgs]: InlineCommandHandler<CommandArgs[key]>;
};

const isPlainText = (
	resultItem: PlainText | Command<keyof CommandArgs>
): resultItem is PlainText => {
	return resultItem.type === 'string';
};

const commandMap: CommandMap = {
	mention: async (companion, { id }) => ({
		companion: {
			mentions: [...companion.mentions, id],
		},
		stringValue: '@' + id.replace('@c.us', ''),
	}),
	invisiblemention: async (comapanion, { id }) => ({
		companion: {
			mentions: [...comapanion.mentions, id],
		},
		stringValue: '',
	}),
	tageveryone: async (companion, _, client, payload) => {
		let mentions: string[] = [];

		const chatInfo = await getChatInfo(client)({ id: payload.chatId });
		if (chatInfo && chatInfo.isGroup) {
			mentions = chatInfo.membersList.map(member => member.id);
		}

		return {
			companion: {
				...companion,
				mentions,
			},
			stringValue: '',
		};
	},
};

const processResultItem = async (
	resultItem: PlainText | Command<keyof CommandMap, any>,
	companionObject: CompanionObject = {
		mentions: [],
	},
	client: Client,
	payload: SendMessagePayload
) => {
	if (isPlainText(resultItem)) {
		return {
			companion: companionObject,
			stringValue: resultItem['value'],
		};
	} else {
		if (!(resultItem.commandName in commandMap)) {
			console.warn(
				`Tried to handle inline-command with name ${resultItem.commandName} but there is not a handler for this.`
			);
			return {
				companion: companionObject,
				stringValue: '',
			};
		}
		return await commandMap[resultItem.commandName](
			companionObject,
			resultItem.commandData,
			client,
			payload
		);
	}
};

const processAllResults = async (
	results: (PlainText | Command<keyof CommandMap, any>)[],
	client: Client,
	payload: SendMessagePayload
) => {
	let companion: CompanionObject = {
		mentions: [],
	};
	let stringValue = '';
	for (let i = 0; i < results.length; i++) {
		let currResult = results[i];

		const { companion: newCompanion, stringValue: newString } =
			await processResultItem(currResult, companion, client, payload);

		companion = newCompanion;
		stringValue += newString;
	}

	return {
		companion,
		stringValue,
	};
};

export const parseAndProcessInlineCommands = (
	messageBody: string,
	client: Client,
	payload: SendMessagePayload
) => {
	const results = parseMessageBody(messageBody);
	return processAllResults(results, client, payload);
};
