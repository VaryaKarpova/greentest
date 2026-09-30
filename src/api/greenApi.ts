import type { Credentials } from "../types";
import type {
  DeleteNotificationResponse,
  ReceiveNotificationResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "./types";

const DEFAULT_API_URL = "https://api.green-api.com";

export class GreenApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GreenApiError";
    this.status = status;
  }
}

type ApiOperation = "send" | "receive" | "delete";

function getErrorMessage(status: number, operation: ApiOperation): string {
  if (status === 400) {
    return operation === "send"
      ? "Проверьте номер получателя и текст сообщения."
      : "Проверьте настройки HTTP API: webhookUrl должен быть пустым, а входящие уведомления включены.";
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

  return operation === "send"
    ? "Не удалось отправить сообщение. Повторите попытку."
    : "Не удалось синхронизировать сообщения. Повторите попытку позже.";
}

function getApiUrl(): string {
  const configuredApiUrl = import.meta.env.VITE_GREEN_API_URL?.trim();
  return (configuredApiUrl || DEFAULT_API_URL).replace(/\/+$/, "");
}

function getInstancePath(credentials: Credentials): string {
  return `${getApiUrl()}/waInstance${encodeURIComponent(credentials.idInstance)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
  const endpoint = `${getInstancePath(credentials)}/sendMessage/${encodeURIComponent(credentials.apiTokenInstance)}`;

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
    throw new GreenApiError(getErrorMessage(response.status, "send"), response.status);
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

export async function receiveNotification(
  credentials: Credentials,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> {
  const endpoint = `${getInstancePath(credentials)}/receiveNotification/${encodeURIComponent(credentials.apiTokenInstance)}?receiveTimeout=5`;
  let response: Response;

  try {
    response = await fetch(endpoint, { method: "GET", signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new GreenApiError("Соединение с GREEN-API потеряно. Повторяем подключение...");
  }

  if (!response.ok) {
    throw new GreenApiError(getErrorMessage(response.status, "receive"), response.status);
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    return null;
  }

  let payload: unknown;

  try {
    payload = JSON.parse(responseText);
  } catch {
    throw new GreenApiError("GREEN-API вернул некорректное уведомление.", response.status);
  }

  if (payload === null) {
    return null;
  }

  if (
    !isRecord(payload) ||
    typeof payload.receiptId !== "number" ||
    !Number.isFinite(payload.receiptId) ||
    !isRecord(payload.body)
  ) {
    throw new GreenApiError("Формат уведомления GREEN-API не поддерживается.", response.status);
  }

  return {
    receiptId: payload.receiptId,
    body: payload.body,
  };
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<void> {
  const endpoint = `${getInstancePath(credentials)}/deleteNotification/${encodeURIComponent(credentials.apiTokenInstance)}/${receiptId}`;
  let response: Response;

  try {
    response = await fetch(endpoint, { method: "DELETE", signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new GreenApiError("Не удалось подтвердить уведомление. Повторяем попытку...");
  }

  if (!response.ok) {
    throw new GreenApiError(getErrorMessage(response.status, "delete"), response.status);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new GreenApiError("GREEN-API вернул некорректный ответ подтверждения.", response.status);
  }

  if (
    !isRecord(payload) ||
    typeof payload.result !== "boolean" ||
    ("reason" in payload && typeof payload.reason !== "string")
  ) {
    throw new GreenApiError("Формат подтверждения GREEN-API не поддерживается.", response.status);
  }

  const result: DeleteNotificationResponse = {
    result: payload.result,
    reason: typeof payload.reason === "string" ? payload.reason : "",
  };

  if (!result.result) {
    throw new GreenApiError("GREEN-API не подтвердил удаление уведомления.", response.status);
  }
}

export function isPermanentNotificationError(error: unknown): boolean {
  return error instanceof GreenApiError && error.status !== undefined && error.status >= 400 && error.status < 500 && error.status !== 429 && error.status !== 466;
}
