import { type BoundaryIntroduction, SignaturelessPayload } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { signPayload } from 'src/util/PayloadSign';

export const registerIntroductionSocketEvent = (socket: Socket) => {
	const introduction: SignaturelessPayload<BoundaryIntroduction> = {
		OS: process.platform,
		platform: 'WA',
		role: 'boundary',
		id: process.env.BOUNDARY_ID,
	};
	socket.emit('introduction', signPayload(introduction));
};
