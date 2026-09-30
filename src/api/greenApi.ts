import type { Credentials } from "../types";
import type { SendMessageRequest, SendMessageResponse } from "./types";

const DEFAULT_API_URL = "https://api.green-api.com";

export class GreenApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GreenApiError";
    this.status = status;
  }
}

function getErrorMessage(status: number): string {
  if (status === 400) {
    return "Проверьте номер получателя и текст сообщения.";
  }

  if (status === 401 || status === 403) {
    return "GREEN-API отклонил учетные данные. Войдите повторно и проверьте настройки инстанса.";
  }

  if (status === 429 || status === 466) {
    return "Превышен лимит запросов GREEN-API. Повторите отправку позже.";
  }

  if (status >= 500) {
    return "GREEN-API временно недоступен. Повторите отправку позже.";
  }

  return "Не удалось отправить сообщение. Повторите попытку.";
}

function isSendMessageResponse(value: unknown): value is SendMessageResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "idMessage" in value &&
    typeof value.idMessage === "string" &&
    value.idMessage.length > 0
  );
}

export async function sendMessage(
  credentials: Credentials,
  request: SendMessageRequest,
  signal?: AbortSignal,
): Promise<SendMessageResponse> {
  const configuredApiUrl = import.meta.env.VITE_GREEN_API_URL?.trim();
  const apiUrl = (configuredApiUrl || DEFAULT_API_URL).replace(/\/+$/, "");
  const endpoint = `${apiUrl}/waInstance${encodeURIComponent(credentials.idInstance)}/sendMessage/${encodeURIComponent(credentials.apiTokenInstance)}`;

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new GreenApiError("Нет соединения с GREEN-API. Проверьте интернет и повторите попытку.");
  }

  if (!response.ok) {
    throw new GreenApiError(getErrorMessage(response.status), response.status);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new GreenApiError("GREEN-API вернул некорректный ответ.", response.status);
  }

  if (!isSendMessageResponse(payload)) {
    throw new GreenApiError("GREEN-API не вернул идентификатор сообщения.", response.status);
  }

  return payload;
}
