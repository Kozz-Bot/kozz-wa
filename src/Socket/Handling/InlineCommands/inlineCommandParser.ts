import * as T from '@guigalleta/t-parser';

export type PlainText = {
	type: 'string';
	value: string;
};

export type Command<N extends string, T extends Record<string, any> = {}> = {
	type: 'command';
	commandName: N;
	commandData: T;
};

const commandParser = T.transform(
	T.sequenceOf(
		[
			T.str('%', 'Command Starter'),
			T.letters,
			T.str(':', 'Command name-payload divider'),
			T.regexMatch(/^[^}]+/, 'Command payload'),
			T.str('}'),
		],
		'Command'
	),
	({ result }) => ({
		type: 'command',
		commandName: result[1],
		commandData: JSON.parse(result[3] + result[4]),
	})
);

const stringParser = T.transform(
	T.regexMatch(/^[^%]+/, 'Any text'),
	({ result }) => ({
		type: 'string',
		value: result,
	})
);

const parser = T.atLeastOne(T.choice([stringParser, commandParser]));

export const parseMessageBody = (string: string) => {
	const { isError, result } = T.parse(string, parser);

	if (isError) {
		return [
			{
				type: 'string',
				value: string,
			} as const,
		];
	}

	return result as (PlainText | Command<any>)[];
};
