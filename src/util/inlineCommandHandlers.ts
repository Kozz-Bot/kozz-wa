import { Client } from 'whatsapp-web.js';
import { Command, parseMessageBody, PlainText } from './inlineCommandParser';

type CompanionObject = {
	mentions: string[];
};

type InlineCommandHandler = (
	companion: CompanionObject,
	data: Command<any, any>['commandData']
) => {
	companion: CompanionObject;
	stringValue: string;
};

const isPlainText = (resultItem: PlainText | Command): resultItem is PlainText => {
	return resultItem.type === 'string';
};

const commandMap: Record<string, InlineCommandHandler> = {
	mention: (
		companion: CompanionObject,
		{ id }: Command<'mention', { id: string }>['commandData']
	) => {
		const newCompanion: CompanionObject = {
			mentions: [...companion.mentions, id],
		};
		return {
			companion: newCompanion,
			stringValue: '@' + id.replace('@c.us', ''),
		};
	},
};

const processResultItem = (
	resultItem: PlainText | Command,
	companionObject: CompanionObject = {
		mentions: [],
	}
) => {
	if (isPlainText(resultItem)) {
		return {
			companion: companionObject,
			stringValue: resultItem['value'],
		};
	} else {
		const commandHandler = commandMap[resultItem.commandName];
		if (!commandHandler) {
			console.warn(
				`Tried to handle inline-command with name ${resultItem.commandName} but there is not a handler for this.`
			);
			return {
				companion: companionObject,
				stringValue: '',
			};
		} else {
			return commandHandler(companionObject, resultItem.commandData);
		}
	}
};

const processAllResults = (results: (PlainText | Command)[]) => {
	return results.reduce(
		(acc, item) => {
			const { companion, stringValue } = processResultItem(item, acc.companion);
			return {
				companion,
				stringValue: (acc.stringValue += stringValue),
			};
		},
		{
			companion: {
				mentions: [],
			},
			stringValue: '',
		} as ReturnType<InlineCommandHandler>
	);
};

export const parseAndProcessInlineCommands = (messageBody: string) => {
	const results: (PlainText | Command)[] = parseMessageBody(messageBody);
	return processAllResults(results);
};
