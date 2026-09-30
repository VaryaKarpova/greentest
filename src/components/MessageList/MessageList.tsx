import { useEffect, useRef } from "react";
import type { Message } from "../../types";

type MessageListProps = {
  messages: Message[];
  isSending: boolean;
  onRetry: (message: Message) => void;
};

const timeFormatter = new Intl.DateTimeFormat("ru", {
  hour: "2-digit",
  minute: "2-digit",
});

export function MessageList({ messages, isSending, onRetry }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="chat-ready">
        <span className="chat-ready__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 12.5v-6Z" />
          </svg>
        </span>
        <h2>Чат создан</h2>
        <p>Напишите первое сообщение. Ответы собеседника появятся здесь после реализации этапа 3.</p>
      </div>
    );
  }

  return (
    <div className="message-list" aria-live="polite">
      <div className="message-list__date">Сегодня</div>
      {messages.map((message) => (
        <article className="message message--outgoing" key={message.id}>
          <p>{message.text}</p>
          <footer>
            <time dateTime={new Date(message.timestamp).toISOString()}>
              {timeFormatter.format(message.timestamp)}
            </time>
            {message.status === "sending" && <span>Отправка...</span>}
            {message.status === "sent" && (
              <span className="message__sent" aria-label="Принято GREEN-API">
                ··
              </span>
            )}
          </footer>
          {message.status === "error" && (
            <div className="message__error">
              <span>{message.error}</span>
              <button type="button" disabled={isSending} onClick={() => onRetry(message)}>
                Повторить
              </button>
            </div>
          )}
        </article>
      ))}
      <div ref={endRef} />
    </div>
  );
}
