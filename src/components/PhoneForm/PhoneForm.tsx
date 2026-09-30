import { useState, type ClipboardEvent, type FormEvent } from "react";
import type { Chat } from "../../types";
import {
  createChatFromPhone,
  formatPhoneDigits,
  normalizePastedPhone,
  PHONE_DIGITS_LENGTH,
} from "../../utils/phone";
import "./PhoneForm.scss";

type PhoneFormProps = {
  onCreate: (chat: Chat) => void;
  compact?: boolean;
};

export function PhoneForm({ onCreate, compact = false }: PhoneFormProps) {
  const [phoneDigits, setPhoneDigits] = useState("");
  const [error, setError] = useState("");
  const isComplete = phoneDigits.length === PHONE_DIGITS_LENGTH;
  const inputId = `phone-${compact ? "compact" : "mobile"}`;
  const errorId = `${inputId}-error`;

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const normalized = normalizePastedPhone(event.clipboardData.getData("text"));

    if (normalized === null) {
      setPhoneDigits("");
      setError("Введите 10 цифр после +7");
      return;
    }

    setPhoneDigits(normalized);
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const chat = createChatFromPhone(phoneDigits);

    if (!chat) {
      setError("Введите 10 цифр после +7");
      return;
    }

    setError("");
    setPhoneDigits("");
    onCreate(chat);
  };

  return (
    <form className={`phone-form${compact ? " phone-form--compact" : ""}`} onSubmit={handleSubmit} noValidate>
      {!compact && (
        <div className="phone-form__heading">
          <span className="eyebrow">Новый чат</span>
          <h2>Кому напишем?</h2>
          <p>Введите 10 цифр номера после +7.</p>
        </div>
      )}
      <div className="phone-form__control">
        <label className="sr-only" htmlFor={inputId}>
          Номер телефона получателя после +7
        </label>
        <span className="phone-form__prefix" aria-hidden="true">+7</span>
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="999 123-45-67"
          value={formatPhoneDigits(phoneDigits)}
          aria-label="Номер телефона получателя"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setPhoneDigits(event.target.value.replace(/\D/g, "").slice(0, PHONE_DIGITS_LENGTH));
            setError("");
          }}
          onPaste={handlePaste}
          onBlur={() => {
            if (phoneDigits && !isComplete) {
              setError("Введите 10 цифр после +7");
            }
          }}
        />
        <button type="submit" aria-label="Создать чат" disabled={!isComplete || Boolean(error)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m7.5 4 6 6-6 6" />
          </svg>
        </button>
      </div>
      <span className="phone-form__error" id={errorId} role="alert">
        {error}
      </span>
    </form>
  );
}
