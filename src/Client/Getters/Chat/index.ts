import { Client, GroupChat, PrivateChat } from "whatsapp-web.js";

export const getChatInfo = async (whatsappBoundary: Client, chatId: string) => {
    try {
        const chatData = await whatsappBoundary.getChatById(chatId);
        if (isGroup(chatData)) {

        } else {

        }
    } catch (e) {
        return null;
    }
}

const isGroup = (chatData: GroupChat | PrivateChat): chatData is GroupChat => {
    return chatData.isGroup
}