# kozz-wa

WhatsApp boundary for Kozz Bot integration using whatsapp-web.js (WWebJS).

## Overview

This boundary replaces `kozz-baileys` and provides WhatsApp connectivity for the Kozz chatbot framework. It uses WWebJS instead of Baileys for improved stability and compatibility with recent WhatsApp updates.

## Features

- Full compatibility with kozz-gateway and kozz-boundary-maker protocol
- Support for text messages, media (images, videos, audio, stickers)
- Message reactions and deletions
- Group chat management
- Contact management
- Profile picture retrieval
- Inline commands (mentions, markdown formatting, tag everyone)
- Resource gathering for modules
- Automatic media cleanup
- QR code authentication

## Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

4. Edit `.env` with your gateway URL and boundary name:

```env
GATEWAY_URL=ws://localhost:4521
BOUNDARY_NAME=kozz-wa
```

## Usage

### Development Mode

```bash
yarn dev
```

### Production Mode

```bash
yarn start
```

## Architecture

The boundary follows the same architecture as kozz-baileys:

- **Client**: WhatsApp client initialization and event handling
- **Store**: In-memory storage for messages, contacts, and chats
- **PayloadTransformers**: Convert WWebJS objects to Kozz protocol payloads
- **Resource**: Resource gatherers for module queries
- **Context**: Global state management

## Compatibility

This boundary is a drop-in replacement for kozz-baileys. It:

- Uses the same event structure
- Implements the same command handlers
- Provides the same resources
- Maintains the same inline command interface

No changes are required to the gateway or modules when switching from kozz-baileys to kozz-wa.

## Key Differences from kozz-baileys

1. **Library**: Uses whatsapp-web.js instead of Baileys
2. **Authentication**: Uses LocalAuth strategy (session stored locally)
3. **Storage**: Simplified in-memory storage (no Realm database)
4. **Media Handling**: Direct base64 encoding without complex conversions

## Supported Commands

- `reply_with_text`: Reply to a message with text
- `reply_with_media`: Reply to a message with media
- `reply_with_sticker`: Reply to a message with a sticker
- `send_message`: Send a text message
- `send_message_with_media`: Send a message with media
- `send_message_with_sticker`: Send a sticker
- `react_message`: React to a message with an emoji
- `delete_message`: Delete a message

## Supported Resources

- `contact_profile_pic`: Get contact profile picture URL
- `group_chat_info`: Get group chat information
- `group_admin_list`: Get list of group admins
- `unread_count`: Get unread message count for a chat
- `chat_details`: Get chat metadata
- `contact_info`: Get contact information
- `chat_order`: Get chat order
- `chat_status`: Get connection status (QR code, ready state)
- `all_groups`: Get all group chats
- `all_private_chats`: Get all private chats

## Inline Commands

- `mention`: Mention a user
- `invisiblemention`: Mention a user invisibly
- `tageveryone`: Tag all group members
- `begin_style`/`end_style`: Apply markdown formatting

## License

MIT
