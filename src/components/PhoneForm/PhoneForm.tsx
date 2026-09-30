import { useState, type FormEvent } from "react";
import type { Chat } from "../../types";
import { createChatFromPhone } from "../../utils/phone";

type PhoneFormProps = {
  onCreate: (chat: Chat) => void;
  compact?: boolean;
};

export function PhoneForm({ onCreate, compact = false }: PhoneFormProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const chat = createChatFromPhone(phone);

    if (!chat) {
      setError("Введите номер, используя цифры, пробелы, скобки или дефисы");
      return;
    }

    setError("");
    setPhone("");
    onCreate(chat);
  };

  return (
    <form className={`phone-form${compact ? " phone-form--compact" : ""}`} onSubmit={handleSubmit} noValidate>
      {!compact && (
        <div className="phone-form__heading">
          <span className="eyebrow">Новый чат</span>
          <h2>Кому напишем?</h2>
          <p>Введите номер в международном формате.</p>
        </div>
      )}
      <div className="phone-form__control">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.5 4h2l1 4-2 1.3a12 12 0 0 0 6.2 6.2l1.3-2 4 1v2A3.5 3.5 0 0 1 16.5 20C9.6 20 4 14.4 4 7.5A3.5 3.5 0 0 1 7.5 4Z" />
        </svg>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (999) 123-45-67"
          value={phone}
          aria-label="Номер телефона получателя"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "phone-error" : undefined}
          onChange={(event) => {
            setPhone(event.target.value);
            setError("");
          }}
        />
        <button type="submit" aria-label="Создать чат">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m7.5 4 6 6-6 6" />
          </svg>
        </button>
      </div>
      {error && (
        <span className="phone-form__error" id="phone-error" role="alert">
          {error}
        </span>
      )}
    </form>
  );
}
