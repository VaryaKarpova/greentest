import { useState } from "react";
import { BrandMark } from "../components/BrandMark";
import { ChatHeader } from "../components/ChatHeader/ChatHeader";
import { MessageComposer } from "../components/MessageComposer/MessageComposer";
import { MessageList } from "../components/MessageList/MessageList";
import { PhoneForm } from "../components/PhoneForm/PhoneForm";
import { useSendMessage } from "../hooks/useSendMessage";
import type { Chat, Credentials, Message } from "../types";
import { formatPhone } from "../utils/phone";

type ChatPageProps = {
  credentials: Credentials;
  onLogout: () => void;
};

export function ChatPage({ credentials, onLogout }: ChatPageProps) {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const sendMutation = useSendMessage(credentials, {
    onSuccess: (response, variables) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === variables.localId
            ? { ...message, idMessage: response.idMessage, status: "sent", error: undefined }
            : message,
        ),
      );
    },
    onError: (error, variables) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === variables.localId
            ? { ...message, status: "error", error: error.message }
            : message,
        ),
      );
    },
  });

  const handleCreateChat = (chat: Chat) => {
    if (chat.chatId !== activeChat?.chatId) {
      setMessages([]);
    }

    setActiveChat(chat);
  };

  const handleSend = (text: string) => {
    if (!activeChat || sendMutation.isPending) {
      return;
    }

    const localId = crypto.randomUUID();
    const message: Message = {
      id: localId,
      text,
      timestamp: Date.now(),
      direction: "outgoing",
      status: "sending",
    };

    setMessages((current) => [...current, message]);
    sendMutation.mutate({ localId, chatId: activeChat.chatId, message: text });
  };

  const handleRetry = (message: Message) => {
    if (!activeChat || sendMutation.isPending) {
      return;
    }

    setMessages((current) =>
      current.map((currentMessage) =>
        currentMessage.id === message.id
          ? { ...currentMessage, status: "sending", error: undefined }
          : currentMessage,
      ),
    );
    sendMutation.mutate({
      localId: message.id,
      chatId: activeChat.chatId,
      message: message.text,
    });
  };

  return (
    <main className="chat-page">
      <aside className="sidebar">
        <div className="sidebar__top">
          <BrandMark />
          <button className="icon-button sidebar__menu" type="button" aria-label="Меню" disabled>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>
        </div>

        <PhoneForm onCreate={handleCreateChat} compact />

        <div className="sidebar__section-head">
          <span>Диалоги</span>
          <span>{activeChat ? 1 : 0}</span>
        </div>

        {activeChat ? (
          <div className="sidebar-chat" aria-current="page">
            <span className="sidebar-chat__avatar" aria-hidden="true">
              {activeChat.phone.slice(-2)}
            </span>
            <div>
              <strong>{formatPhone(activeChat.phone)}</strong>
              <span>{messages.at(-1)?.text ?? "Новый диалог"}</span>
            </div>
            <time>{messages.length > 0 ? new Intl.DateTimeFormat("ru", { hour: "2-digit", minute: "2-digit" }).format(messages.at(-1)!.timestamp) : ""}</time>
          </div>
        ) : (
          <div className="sidebar__empty">
            <span className="sidebar__empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 12.5v-6Z" />
              </svg>
            </span>
            <p>Введите номер выше, чтобы создать первый диалог</p>
          </div>
        )}

        <div className="sidebar__spacer" />
        <div className="sidebar__footer">
          <span className="connection-dot" aria-hidden="true" />
          <div>
            <strong>Сессия защищена</strong>
            <span>Данные хранятся в этой вкладке</span>
          </div>
        </div>
      </aside>

      <section className="conversation">
        <ChatHeader idInstance={credentials.idInstance} chat={activeChat} onLogout={onLogout} />

        <div className={`conversation__body${activeChat ? " conversation__body--active" : ""}`}>
          <div className="mobile-phone-form">
            <PhoneForm onCreate={handleCreateChat} />
          </div>

          {activeChat ? (
            <MessageList
              messages={messages}
              isSending={sendMutation.isPending}
              onRetry={handleRetry}
            />
          ) : (
            <div className="empty-chat">
              <div className="empty-chat__illustration" aria-hidden="true">
                <span className="empty-chat__orbit empty-chat__orbit--one" />
                <span className="empty-chat__orbit empty-chat__orbit--two" />
                <svg viewBox="0 0 120 120">
                  <path className="empty-chat__bubble" d="M22 28c0-8 6-14 14-14h49c8 0 14 6 14 14v34c0 8-6 14-14 14H59L36 97l5-21h-5c-8 0-14-6-14-14V28Z" />
                  <path className="empty-chat__line" d="M41 37h39M41 50h27M41 63h19" />
                  <path className="empty-chat__spark" d="m83 79 4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8Z" />
                </svg>
              </div>
              <span className="eyebrow">Все готово</span>
              <h2>Начните новый диалог</h2>
              <p>Введите номер телефона получателя, чтобы отправить сообщение в MAX.</p>
            </div>
          )}
        </div>

        <MessageComposer
          disabled={!activeChat}
          isSending={sendMutation.isPending}
          onSend={handleSend}
        />
      </section>
    </main>
  );
}
