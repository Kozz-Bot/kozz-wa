import { Socket } from 'socket.io-client';
import {
	createUserJoinedGroupPayload,
	createUserLeftGroupPayload,
} from 'src/Payload/ForwardableEvent/GroupEvents';
import { Client, GroupNotification } from 'whatsapp-web.js';

export const onUserJoinedGroup =
	(whatsAppBoundary: Client, socket: Socket) => async (event: GroupNotification) => {
		const payload = await createUserJoinedGroupPayload(event);
		socket.emit('forward_event', {
			eventName: 'user_joined_group',
			payload,
		});
	};

export const onUserLeftGroup =
	(whatsAppBoundary: Client, socket: Socket) => async (event: GroupNotification) => {
		const payload = await createUserLeftGroupPayload(event);
		socket.emit('forward_event', {
			eventName: 'user_left_group',
			payload,
		});
	};
