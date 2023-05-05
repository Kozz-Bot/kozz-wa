import { type BoundaryIntroduction } from 'kozz-types';
import { Socket } from 'socket.io-client';

export const registerIntroductionSocketEvent = (socket: Socket) => {
	const introduction: BoundaryIntroduction = {
		OS: process.platform,
		platform: 'WA',
		role: 'boundary',
		timestamp: new Date().getTime(),
		id: process.env.BOUNDARY_ID,
	};
	socket.emit('introduction', introduction);
};
