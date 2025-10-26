# kozz-wa Implementation Summary

## Overview

This document summarizes the implementation of kozz-wa, a WhatsApp boundary for the Kozz chatbot framework using whatsapp-web.js (WWebJS) as a replacement for kozz-baileys.

## Architecture

### Core Components

#### 1. Client (`src/Client/`)

- **index.ts**: Initializes WWebJS client, handles authentication, and manages WhatsApp events
- **WaFunctions.ts**: Implements core WhatsApp operations (send messages, media, reactions, deletions)
- **inlineCommandMap.ts**: Defines inline command handlers (mentions, markdown, tag everyone)
- **markdown.ts**: Markdown formatting utilities

#### 2. Store (`src/Store/`)

In-memory storage for:

- **ChatStore.ts**: Group and private chats, chat metadata
- **ContactStore.ts**: Contact information
- **MessageStore.ts**: Messages with original payloads
- **MetadataStore.ts**: Chat ordering

#### 3. PayloadTransformers (`src/PayloadTransformers/`)

Converts WWebJS objects to Kozz protocol payloads:

- Contact payloads
- Message payloads
- Group chat payloads
- Tagged contact handling

#### 4. Resource (`src/Resource/`)

Implements resource gatherers for module queries:

- Profile pictures
- Group information
- Admin lists
- Unread counts
- Chat status

#### 5. Context (`src/Context/`)

Global state management:

- QR code state
- Connection status
- Host data
- Blocked list

#### 6. Utilities (`src/util/`)

- **utility.ts**: Helper functions (date formatting, contact sanitization, etc.)
- **media.ts**: Media download and conversion
- **utilityTypes.ts**: Type definitions

## Key Features

### Message Handling

- Text messages with mentions
- Media messages (images, videos, audio, documents)
- Stickers with custom metadata
- Voice notes
- Message reactions
- Message deletions
- Quoted messages

### Group Management

- Group chat information
- Participant management
- Admin detection
- Tag everyone functionality

### Authentication

- QR code generation and display
- LocalAuth strategy (persistent sessions)
- Automatic reconnection

### Media Processing

- Base64 encoding/decoding
- Media type detection
- Sticker creation with metadata

### Inline Commands

- `mention`: Tag specific users
- `invisiblemention`: Silent mentions
- `tageveryone`: Tag all group members
- `begin_style`/`end_style`: Markdown formatting

## Protocol Compatibility

### Command Handlers

All kozz-boundary-maker command handlers are implemented:

- `reply_with_text`
- `reply_with_media`
- `reply_with_sticker`
- `send_message`
- `send_message_with_media`
- `send_message_with_sticker`
- `react_message`
- `delete_message`

### Resource Gatherers

All standard resources are available:

- `contact_profile_pic`
- `group_chat_info`
- `group_admin_list`
- `unread_count`
- `chat_details`
- `contact_info`
- `chat_order`
- `chat_status`
- `all_groups`
- `all_private_chats`

### Events

Emits all required events:

- `message`: New message received
- `user_joined_group`: User joined a group
- `user_left_group`: User left a group
- `chat_order_move_to_top`: Chat moved to top
- `kozz-iwac` events: QR code, chat ready, reconnecting

## Differences from kozz-baileys

### Advantages

1. **Stability**: WWebJS is more stable with recent WhatsApp updates
2. **Simplicity**: Simpler authentication and session management
3. **Maintenance**: Better maintained library
4. **Storage**: Simplified in-memory storage (no Realm database)

### Implementation Differences

1. **Library**: whatsapp-web.js instead of Baileys
2. **Auth**: LocalAuth instead of multi-file auth state
3. **Storage**: In-memory Maps instead of Realm database
4. **Media**: Direct base64 handling without complex conversions
5. **IDs**: Uses WWebJS serialized IDs format

## Configuration

### Environment Variables

```env
GATEWAY_URL=ws://localhost:4521
BOUNDARY_NAME=kozz-wa
```

### Dependencies

Key dependencies:

- `whatsapp-web.js`: WhatsApp client
- `kozz-boundary-maker`: Boundary protocol implementation
- `kozz-types`: Type definitions
- `qrcode-terminal`: QR code display
- `cron`: Scheduled tasks
- `dotenv`: Environment configuration

## Testing

To test the boundary:

1. Start the gateway:

```bash
cd kozz-gw && yarn start
```

2. Start kozz-wa:

```bash
cd kozz-wa && yarn start
```

3. Scan the QR code with WhatsApp
4. Send a test message to verify connectivity

## Maintenance

### Media Cleanup

Automatic cleanup of old media files runs every 10 minutes via cron job.

### Session Persistence

Sessions are stored in `.wwebjs_auth/` directory and persist across restarts.

## Future Enhancements

Potential improvements:

1. Persistent storage (database integration)
2. Message history sync
3. Enhanced media processing
4. Group event handling (member add/remove)
5. Status updates
6. Call handling
7. Business account features

## Compatibility Matrix

| Feature        | kozz-baileys | kozz-wa | Status     |
| -------------- | ------------ | ------- | ---------- |
| Text Messages  | ✅           | ✅      | Compatible |
| Media Messages | ✅           | ✅      | Compatible |
| Stickers       | ✅           | ✅      | Compatible |
| Reactions      | ✅           | ✅      | Compatible |
| Deletions      | ✅           | ✅      | Compatible |
| Group Info     | ✅           | ✅      | Compatible |
| Mentions       | ✅           | ✅      | Compatible |
| Tag Everyone   | ✅           | ✅      | Compatible |
| Profile Pics   | ✅           | ✅      | Compatible |
| Resources      | ✅           | ✅      | Compatible |

## Conclusion

kozz-wa successfully replicates all functionality of kozz-baileys while using a more stable and maintainable WhatsApp library. It is a drop-in replacement that requires no changes to the gateway or modules.
