import fs from 'fs';
import crypto from 'crypto';

let privateKey: string | undefined;

export const signPayload = <T extends Record<string, any>>(payload: T) => {
	try {
		privateKey = fs.readFileSync('./keys/privatekey.pem', {
			encoding: 'utf-8',
		});
	} catch (e) {
		throw 'Please generate a keypair using the script "scripts/generate_key_pair.sh" and copy the publickey to the  "${gateway_root}/keys/publickey.pem". Leve the key names as it is';
	}

	const signature = crypto.sign(
		'sha256',
		Buffer.from(JSON.stringify(payload, undefined, '  ')),
		{ key: privateKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }
	);

	return {
		...payload,
		signature,
	};
};
