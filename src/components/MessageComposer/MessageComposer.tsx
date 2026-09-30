import { useState, type FormEvent, type KeyboardEvent } from "react";

const MAX_MESSAGE_LENGTH = 4000;

type MessageComposerProps = {
  disabled: boolean;
  isSending: boolean;
  onSend: (message: string) => void;
};

export function MessageComposer({ disabled, isSending, onSend }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const trimmedMessage = message.trim();
  const isSubmitDisabled = disabled || isSending || !trimmedMessage;
  const showCounter = message.length >= 3600;

  const submitMessage = () => {
    if (isSubmitDisabled) {
      return;
    }

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <button className="icon-button composer__attach" type="button" aria-label="Вложения недоступны" disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m8 12.5 5.8-5.8a3 3 0 0 1 4.2 4.2l-7.5 7.5a4.5 4.5 0 1 1-6.4-6.4l7.2-7.2" />
        </svg>
      </button>
      <label className="composer__input">
        <span className="sr-only">Текст сообщения</span>
        <textarea
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder={disabled ? "Сначала выберите получателя" : "Напишите сообщение..."}
          value={message}
          disabled={disabled}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        {showCounter && (
          <span className="composer__counter" aria-live="polite">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
      </label>
      <button
        className="composer__send"
        type="submit"
        aria-label={isSending ? "Сообщение отправляется" : "Отправить сообщение"}
        disabled={isSubmitDisabled}
      >
        {isSending ? (
          <span className="spinner" aria-hidden="true" />
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4 5 16 7-16 7 3-7-3-7Z" />
            <path d="M7 12h13" />
          </svg>
        )}
      </button>
    </form>
  );
}
