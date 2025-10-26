type ContextData = {
	qr: string | null;
	ready: boolean;
	hostData: {
		id: string;
		name: string;
	};
	blockedList: string[];
};

const context: ContextData = {
	qr: null,
	ready: false,
	hostData: {
		id: '',
		name: '',
	},
	blockedList: [],
};

export const setHostData = (id: string, name: string) => {
	context.hostData = { id, name };
};

export const upsert = (data: Partial<ContextData>) => {
	Object.assign(context, data);
};

export const get = <K extends keyof ContextData>(key: K): ContextData[K] => {
	return context[key];
};

export default {
	get,
	upsert,
	setHostData,
};
