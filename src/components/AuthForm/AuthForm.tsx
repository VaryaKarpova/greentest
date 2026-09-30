import { useState, type FormEvent } from "react";
import type { Credentials } from "../../types";

type AuthFormProps = {
  onSubmit: (credentials: Credentials) => void;
};

type FormErrors = Partial<Record<keyof Credentials, string>>;

export function AuthForm({ onSubmit }: AuthFormProps) {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextCredentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };
    const nextErrors: FormErrors = {};

    if (!nextCredentials.idInstance) {
      nextErrors.idInstance = "Введите идентификатор инстанса";
    }

    if (!nextCredentials.apiTokenInstance) {
      nextErrors.apiTokenInstance = "Введите API-токен инстанса";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSubmit(nextCredentials);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor="idInstance">
          ID инстанса
        </label>
        <input
          className="field__control"
          id="idInstance"
          name="idInstance"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Например, 1101000001"
          value={idInstance}
          aria-invalid={Boolean(errors.idInstance)}
          aria-describedby={errors.idInstance ? "idInstance-error" : "idInstance-hint"}
          onChange={(event) => {
            setIdInstance(event.target.value);
            setErrors((current) => ({ ...current, idInstance: undefined }));
          }}
        />
        {errors.idInstance ? (
          <span className="field__error" id="idInstance-error">
            {errors.idInstance}
          </span>
        ) : (
          <span className="field__hint" id="idInstance-hint">
            Указан в личном кабинете GREEN-API
          </span>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="apiTokenInstance">
          API-токен
        </label>
        <div className="field__password">
          <input
            className="field__control field__control--password"
            id="apiTokenInstance"
            name="apiTokenInstance"
            type={isTokenVisible ? "text" : "password"}
            autoComplete="off"
            placeholder="Введите токен инстанса"
            value={apiTokenInstance}
            aria-invalid={Boolean(errors.apiTokenInstance)}
            aria-describedby={errors.apiTokenInstance ? "apiToken-error" : "apiToken-hint"}
            onChange={(event) => {
              setApiTokenInstance(event.target.value);
              setErrors((current) => ({ ...current, apiTokenInstance: undefined }));
            }}
          />
          <button
            className="field__reveal"
            type="button"
            aria-label={isTokenVisible ? "Скрыть API-токен" : "Показать API-токен"}
            aria-pressed={isTokenVisible}
            onClick={() => setIsTokenVisible((current) => !current)}
          >
            {isTokenVisible ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m4 4 16 16M10.6 10.7a2 2 0 0 0 2.7 2.7M9.5 5.3A10.8 10.8 0 0 1 12 5c5 0 8.5 4.3 9 6.3a2.5 2.5 0 0 1 0 1.4 9.7 9.7 0 0 1-2 3.5M6.6 6.6C4.5 7.8 3 9.8 2.6 11.3a2.5 2.5 0 0 0 0 1.4C3.1 14.7 6.6 19 12 19c1 0 2-.2 2.8-.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.6 11.3C3.1 9.3 6.6 5 12 5s8.9 4.3 9.4 6.3a2.5 2.5 0 0 1 0 1.4C20.9 14.7 17.4 19 12 19s-8.9-4.3-9.4-6.3a2.5 2.5 0 0 1 0-1.4Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.apiTokenInstance ? (
          <span className="field__error" id="apiToken-error">
            {errors.apiTokenInstance}
          </span>
        ) : (
          <span className="field__hint" id="apiToken-hint">
            Хранится только до закрытия вкладки
          </span>
        )}
      </div>

      <button className="button button--primary auth-form__submit" type="submit">
        Продолжить
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m7.5 4 6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
