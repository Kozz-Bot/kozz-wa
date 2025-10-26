import initBoundary from 'kozz-boundary-maker';
import { waFunctions } from 'src/Client/WaFunctions';
import Context from 'src/Context';
import { Client } from 'whatsapp-web.js';
import { createGroupChatPayload } from 'src/PayloadTransformers';

export const createResourceGatherers = (
	boundary: ReturnType<typeof initBoundary>,
	wa: ReturnType<typeof waFunctions>,
	client: Client
) => {
	const _getProfilePicUrl = async ({ id }: { id: string }) => {
		if (!id) {
			return console.warn('Tried to fetch profile pic but no ID was provided!');
		}

		const picUrl = await wa.getProfilePic(id);
		return picUrl;
	};

	const _getGroupChatInfo = async ({ id }: { id: string }) => {
		if (!id) {
			return console.warn('Tried to fetch group chat info but no ID was provided');
		}
		if (!id.includes('@g.us')) {
			return console.warn(
				'Tried to fetch group chat info but got an invalid ID:',
				id
			);
		}

		try {
			const chat = await client.getChatById(id);
			if (!chat.isGroup) {
				return console.warn('Chat is not a group:', id);
			}

			const groupData = createGroupChatPayload(chat as any);
			return groupData;
		} catch (e) {
			console.warn('Unable to fetch group chat info for ID:', id, e);
			return undefined;
		}
	};

	const _groupAdminList = async ({ id }: { id: string }) => {
		if (!id) {
			return console.warn('Tried to fetch group chat info but no ID was provided');
		}
		if (!id.includes('@g.us')) {
			return console.warn(
				'Tried to fetch group chat info but got an invalid ID:',
				id
			);
		}

		try {
			const chat = await client.getChatById(id);
			if (!chat.isGroup) {
				return console.warn('Chat is not a group:', id);
			}

			const groupData = createGroupChatPayload(chat as any);
			if (!groupData) {
				return console.warn('Unable to fetch admin list from group ID:', id);
			}

			return {
				adminList: groupData.participants?.filter(member => member.admin),
			};
		} catch (e) {
			console.warn('Unable to fetch admin list from group ID:', id, e);
			return undefined;
		}
	};

	const _getUnreadCount = async ({ id }: { id: string }) => {
		try {
			const chat = await client.getChatById(id);
			return chat.unreadCount || 0;
		} catch (e) {
			console.warn('Unable to fetch unread count for chat:', id, e);
			return 0;
		}
	};

	const _getChatDetails = async ({ id }: { id: string }) => {
		try {
			const chat = await client.getChatById(id);
			return {
				id: chat.id._serialized,
				unreadCount: chat.unreadCount || 0,
				lastMessageTimestamp: chat.timestamp || 0,
			};
		} catch (e) {
			console.warn('Unable to fetch chat details for:', id, e);
			return undefined;
		}
	};

	const _getContactInfo = async ({ id }: { id: string }) => {
		if (!id) {
			return console.warn('Tried to fetch contact info but no ID was provided');
		}
		if (id.includes('@g.us')) {
			return console.warn('Tried to fetch contact info but got an invalid ID:', id);
		}

		try {
			const contact = await client.getContactById(id);
			const hostData = Context.get('hostData');

			return {
				hostAdded: false,
				id: contact.id._serialized,
				isHostAccount: hostData.id === contact.id._serialized,
				isBlocked: contact.isBlocked || false,
				publicName: contact.pushname || contact.name || '',
				isGroup: contact.isGroup,
				privateName: contact.name || '',
			};
		} catch (e) {
			console.warn('Unable to fetch contact info for:', id, e);
			return undefined;
		}
	};

	const _chatStatus = () => {
		return {
			qr: Context.get('qr'),
			ready: Context.get('ready'),
		};
	};

	const _getAllGroups = async () => {
		try {
			const chats = await client.getChats();
			const groups = chats
				.filter(chat => chat.isGroup)
				.map(chat => createGroupChatPayload(chat as any))
				.filter(group => group !== undefined);
			return groups;
		} catch (e) {
			console.warn('Unable to fetch all groups:', e);
			return [];
		}
	};

	const _getAllPrivateChats = async () => {
		try {
			const chats = await client.getChats();
			const privateChats = chats
				.filter(chat => !chat.isGroup)
				.map(chat => ({ id: chat.id._serialized }));
			return privateChats;
		} catch (e) {
			console.warn('Unable to fetch all private chats:', e);
			return [];
		}
	};

	const _getChatOrder = async () => {
		try {
			const chats = await client.getChats();
			// Sort by timestamp (most recent first)
			const sortedChats = chats.sort(
				(a, b) => (b.timestamp || 0) - (a.timestamp || 0)
			);
			return sortedChats.map(chat => chat.id._serialized);
		} catch (e) {
			console.warn('Unable to fetch chat order:', e);
			return [];
		}
	};

	boundary.onAskResource('contact_profile_pic', _getProfilePicUrl);
	boundary.onAskResource('group_chat_info', _getGroupChatInfo);
	boundary.onAskResource('group_admin_list', _groupAdminList);
	boundary.onAskResource('unread_count', _getUnreadCount);
	boundary.onAskResource('chat_details', _getChatDetails);
	boundary.onAskResource('contact_info', _getContactInfo);
	boundary.onAskResource('chat_order', _getChatOrder);
	boundary.onAskResource('chat_status', _chatStatus);
	boundary.onAskResource('all_groups', _getAllGroups);
	boundary.onAskResource('all_private_chats', _getAllPrivateChats);
};
