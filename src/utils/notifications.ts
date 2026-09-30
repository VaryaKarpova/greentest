import type {
  GenericNotificationBody,
  IncomingTextMessage,
  IncomingTextNotificationBody,
} from "../api/types";
import type { Chat } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function extractIncomingTextMessage(
  body: GenericNotificationBody,
): IncomingTextMessage | null {
  if (
    body.typeWebhook !== "incomingMessageReceived" ||
    typeof body.idMessage !== "string" ||
    typeof body.timestamp !== "number" ||
    !isRecord(body.senderData) ||
    typeof body.senderData.chatId !== "string" ||
    (typeof body.senderData.senderPhoneNumber !== "number" &&
      typeof body.senderData.senderPhoneNumber !== "string") ||
    !isRecord(body.messageData) ||
    body.messageData.typeMessage !== "textMessage" ||
    !isRecord(body.messageData.textMessageData) ||
    typeof body.messageData.textMessageData.textMessage !== "string"
  ) {
    return null;
  }

  const notification = body as IncomingTextNotificationBody;
  const text = notification.messageData.textMessageData.textMessage.trim();

  if (!text || !notification.idMessage) {
    return null;
  }

  return {
    idMessage: notification.idMessage,
    chatId: notification.senderData.chatId,
    senderPhoneNumber: String(notification.senderData.senderPhoneNumber),
    timestamp: notification.timestamp,
    text,
  };
}

export function isMessageForChat(message: IncomingTextMessage, chat: Chat): boolean {
  return (
    message.chatId === chat.chatId ||
    message.chatId === chat.phone ||
    message.senderPhoneNumber === chat.phone
  );
}
