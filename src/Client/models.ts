import { Client, Message } from 'whatsapp-web.js';

/**
 * Statically typing this using the correct method overload is
 * a pain.
 *
 * https://stackoverflow.com/questions/74208041/infer-a-parameter-of-an-overload-function
 *
 * I just copied the type definitions from the lib and retyped all the overloads in
 * my own code
 */
export type WhatsAppEvents = Partial<{
	message_create: (message: Message) => Client | void;
}>;
