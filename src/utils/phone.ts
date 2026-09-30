import type { Chat } from "../types";

const PHONE_CHARACTERS = /^\+?[\d\s()-]+$/;

export function createChatFromPhone(value: string): Chat | null {
  const trimmedValue = value.trim();

  if (!trimmedValue || !PHONE_CHARACTERS.test(trimmedValue)) {
    return null;
  }

  const phone = trimmedValue.replace(/\D/g, "");

  if (!phone) {
    return null;
  }

  return {
    phone,
    chatId: `${phone}@c.us`,
  };
}

export function formatPhone(phone: string): string {
  if (phone.length === 11 && phone.startsWith("7")) {
    return `+${phone.slice(0, 1)} ${phone.slice(1, 4)} ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
  }

  return `+${phone}`;
}
