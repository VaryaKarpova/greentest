import { useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import "./MessageComposer.scss";

const MAX_MESSAGE_LENGTH = 4000;

type MessageComposerProps = {
  disabled: boolean;
  isSending: boolean;
  error?: string;
  onSend: (message: string) => boolean;
};

export function MessageComposer({ disabled, isSending, error, onSend }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmedMessage = message.trim();
  const isSubmitDisabled = disabled || isSending || !trimmedMessage;
  const showCounter = message.length >= 3600;

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [message]);

  const submitMessage = () => {
    if (isSubmitDisabled) {
      return;
    }

    if (onSend(trimmedMessage)) {
      setMessage("");
    }
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
    <form className={`composer${error ? " composer--error" : ""}`} onSubmit={handleSubmit}>
           <div className="composer__error-wrapper"> <span className="composer__error" id="composer-error" role="alert">
        {error ?? ""}
      </span></div>
      <div className="composer__surface">
        <label className="composer__input">
          <span className="sr-only">Текст сообщения</span>
          <textarea
            ref={textareaRef}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={disabled ? "Сначала выберите получателя" : "Напишите сообщение..."}
            value={message}
            disabled={disabled}
            aria-describedby={error ? "composer-error" : undefined}
            aria-invalid={Boolean(error)}
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
      </div>
    </form>
  );
}
