import { BrandMark } from "../components/BrandMark";
import { ChatHeader } from "../components/ChatHeader/ChatHeader";

type ChatPageProps = {
  idInstance: string;
  onLogout: () => void;
};

export function ChatPage({ idInstance, onLogout }: ChatPageProps) {
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

        <div className="sidebar__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
          </svg>
          <input type="tel" placeholder="Номер телефона" disabled aria-label="Номер телефона" />
          <span>Этап 2</span>
        </div>

        <div className="sidebar__section-head">
          <span>Диалоги</span>
          <span>0</span>
        </div>

        <div className="sidebar__empty">
          <span className="sidebar__empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 12.5v-6Z" />
            </svg>
          </span>
          <p>Здесь появится ваш первый диалог</p>
        </div>

        <div className="sidebar__footer">
          <span className="connection-dot" aria-hidden="true" />
          <div>
            <strong>Сессия защищена</strong>
            <span>Данные хранятся в этой вкладке</span>
          </div>
        </div>
      </aside>

      <section className="conversation">
        <ChatHeader idInstance={idInstance} onLogout={onLogout} />

        <div className="conversation__body">
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
            <p>
              На следующем этапе здесь можно будет указать номер телефона и отправить первое сообщение в MAX.
            </p>
          </div>
        </div>

        <div className="composer" aria-label="Поле сообщения пока недоступно">
          <button className="icon-button" type="button" aria-label="Добавить вложение" disabled>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m8 12.5 5.8-5.8a3 3 0 0 1 4.2 4.2l-7.5 7.5a4.5 4.5 0 1 1-6.4-6.4l7.2-7.2" />
            </svg>
          </button>
          <input type="text" placeholder="Сначала выберите получателя" disabled />
          <button className="composer__send" type="button" aria-label="Отправить сообщение" disabled>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m4 5 16 7-16 7 3-7-3-7Z" />
              <path d="M7 12h13" />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
}
