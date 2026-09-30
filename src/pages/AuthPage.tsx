import { AuthForm } from "../components/AuthForm/AuthForm";
import { BrandMark } from "../components/BrandMark";
import type { Credentials } from "../types";

type AuthPageProps = {
  onLogin: (credentials: Credentials) => void;
};

export function AuthPage({ onLogin }: AuthPageProps) {
  return (
    <main className="auth-page">
      <section className="auth-page__intro" aria-label="О приложении">
        <BrandMark />
        <div className="auth-page__message">
          <span className="eyebrow">Только важное</span>
          <h1>Сообщения MAX<br />без лишнего шума</h1>
          <p>
            Легкий интерфейс для личной переписки через ваш инстанс GREEN-API.
          </p>
        </div>
        <div className="auth-page__preview" aria-hidden="true">
          <div className="preview-message preview-message--incoming">
            Привет! Ты уже на связи?
          </div>
          <div className="preview-message preview-message--outgoing">
            Да, пишу через MAX Bridge
            <span>12:42 ··</span>
          </div>
        </div>
        <p className="auth-page__copyright">GREEN-API integration · 2026</p>
      </section>

      <section className="auth-page__panel">
        <div className="auth-card">
          <div className="auth-card__mobile-brand">
            <BrandMark />
          </div>
          <span className="auth-card__step">Подключение</span>
          <h2>Войдите в инстанс</h2>
          <p className="auth-card__lead">
            Используйте данные из личного кабинета GREEN-API для MAX.
          </p>
          <AuthForm onSubmit={onLogin} />
          <div className="security-note">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="3" />
              <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
            </svg>
            <p>
              Данные остаются в текущей вкладке и удаляются при выходе.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
