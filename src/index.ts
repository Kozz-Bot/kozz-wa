import dotenv from 'dotenv';
dotenv.config();

import { io } from 'socket.io-client';
import whatsappBoundary from './Client';
const socket = io('http://gramont.ddns.net:4521');

whatsappBoundary(socket).initialize();
