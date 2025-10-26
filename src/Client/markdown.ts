import { StyleVariant } from 'kozz-boundary-maker/dist/InlineCommand';

export const getMarkdownFor = (variant: StyleVariant, position: 'begin' | 'end') => {
	const markdownMap: Record<'begin' | 'end', Record<StyleVariant, string>> = {
		begin: {
			bold: '*',
			code: '```',
			italic: '_',
			listItem: '- ',
			monospace: '`',
			paragraph: '> ',
			stroke: '~',
		},
		end: {
			bold: '*',
			code: '```',
			italic: '_',
			listItem: '',
			monospace: '`',
			paragraph: '',
			stroke: '~',
		},
	};

	return markdownMap[position][variant];
};
