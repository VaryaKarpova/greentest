import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  deleteNotification,
  isPermanentNotificationError,
  receiveNotification,
} from "../api/greenApi";
import type { IncomingTextMessage } from "../api/types";
import type { Chat, Credentials } from "../types";
import { extractIncomingTextMessage, isMessageForChat } from "../utils/notifications";

export type NotificationConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

type UseNotificationsOptions = {
  credentials: Credentials;
  activeChat: Chat | null;
  onMessage: (message: IncomingTextMessage) => void;
};

type PollResult = {
  receivedAt: number;
  hadNotification: boolean;
};

export function useNotifications({
  credentials,
  activeChat,
  onMessage,
}: UseNotificationsOptions) {
  const processedMessageIds = useRef(new Set<string>());
  const activeChatRef = useRef(activeChat);
  const onMessageRef = useRef(onMessage);

  activeChatRef.current = activeChat;
  onMessageRef.current = onMessage;

  const query = useQuery<PollResult, Error>({
    queryKey: ["notifications", credentials.idInstance],
    queryFn: async ({ signal }) => {
      const notification = await receiveNotification(credentials, signal);

      if (!notification) {
        return { receivedAt: Date.now(), hadNotification: false };
      }

      const incomingMessage = extractIncomingTextMessage(notification.body);
      const currentChat = activeChatRef.current;

      if (
        incomingMessage &&
        currentChat &&
        isMessageForChat(incomingMessage, currentChat) &&
        !processedMessageIds.current.has(incomingMessage.idMessage)
      ) {
        processedMessageIds.current.add(incomingMessage.idMessage);
        onMessageRef.current(incomingMessage);
      }

      await deleteNotification(credentials, notification.receiptId, signal);

      return { receivedAt: Date.now(), hadNotification: true };
    },
    refetchInterval: (currentQuery) => {
      if (isPermanentNotificationError(currentQuery.state.error)) {
        return false;
      }

      if (currentQuery.state.status === "error") {
        return 8_000;
      }

      return currentQuery.state.data?.hadNotification ? 250 : 1_000;
    },
    refetchIntervalInBackground: false,
    retry: (failureCount, error) =>
      !isPermanentNotificationError(error) && failureCount < 3,
    retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 8_000),
    staleTime: 0,
    gcTime: 0,
  });

  let status: NotificationConnectionStatus;

  if (query.error && isPermanentNotificationError(query.error)) {
    status = "error";
  } else if (query.isError || query.fetchStatus === "paused") {
    status = "reconnecting";
  } else if (query.data) {
    status = "connected";
  } else {
    status = "connecting";
  }

  return {
    status,
    error: query.error?.message ?? null,
  };
}
