import { Command, parseMessageBody, PlainText } from './inlineCommandParser';

type CompanionObject = {
	mentions: string[];
};

type CommandArgs = {
	mention: { id: string };
	invisiblemention: { id: string };
};

type InlineCommandHandler<T extends Record<string, any>> = (
	companion: CompanionObject,
	data: Command<any, T>['commandData']
) => {
	companion: CompanionObject;
	/**
	 * This string will substitute the inline command payload
	 */
	stringValue: string;
};

type CommandMap = {
	[key in keyof CommandArgs]: InlineCommandHandler<CommandArgs[key]>;
};

const isPlainText = (
	resultItem: PlainText | Command<keyof CommandArgs>
): resultItem is PlainText => {
	return resultItem.type === 'string';
};

const commandMap: CommandMap = {
	mention: (companion, { id }) => ({
		companion: {
			mentions: [...companion.mentions, id],
		},
		stringValue: '@' + id.replace('@c.us', ''),
	}),
	invisiblemention: (comapanion, { id }) => ({
		companion: {
			mentions: [...comapanion.mentions, id],
		},
		stringValue: '',
	}),
};

const processResultItem = (
	resultItem: PlainText | Command<keyof CommandMap, any>,
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
		if (!(resultItem.commandName in commandMap)) {
			console.warn(
				`Tried to handle inline-command with name ${resultItem.commandName} but there is not a handler for this.`
			);
			return {
				companion: companionObject,
				stringValue: '',
			};
		}
		return commandMap[resultItem.commandName](
			companionObject,
			resultItem.commandData
		);
	}
};

const processAllResults = (
	results: (PlainText | Command<keyof CommandMap, any>)[]
) => {
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
		} as ReturnType<InlineCommandHandler<{}>>
	);
};

export const parseAndProcessInlineCommands = (messageBody: string) => {
	const results = parseMessageBody(messageBody);
	return processAllResults(results);
};
