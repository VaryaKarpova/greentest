import type { Chat } from "../../types";
import { formatPhone } from "../../utils/phone";

type ChatHeaderProps = {
  idInstance: string;
  chat: Chat | null;
  onLogout: () => void;
};

export function ChatHeader({ idInstance, chat, onLogout }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="chat-header__identity">
        <div className="chat-header__avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 19a7 7 0 0 1 14 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          </svg>
        </div>
        <div>
          <h1>{chat ? formatPhone(chat.phone) : "Новый диалог"}</h1>
          <p>{chat ? "Личный чат MAX" : "Выберите получателя, чтобы начать"}</p>
        </div>
      </div>

      <div className="chat-header__session">
        <span className="chat-header__status" aria-label="Сессия активна">
          <i aria-hidden="true" />
          <span>Инстанс {idInstance}</span>
        </span>
        <button className="icon-button" type="button" onClick={onLogout} aria-label="Выйти">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M18 12H9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
