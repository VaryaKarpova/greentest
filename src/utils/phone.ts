import type { Chat } from "../types";

export const PHONE_DIGITS_LENGTH = 10;

export function normalizePastedPhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");

  if (digits.length === PHONE_DIGITS_LENGTH + 1 && /^[78]/.test(digits)) {
    digits = digits.slice(1);
  }

  return digits.length <= PHONE_DIGITS_LENGTH ? digits : null;
}

export function formatPhoneDigits(phoneDigits: string): string {
  const groups = [
    phoneDigits.slice(0, 3),
    phoneDigits.slice(3, 6),
    phoneDigits.slice(6, 8),
    phoneDigits.slice(8, 10),
  ].filter(Boolean);

  return groups.reduce((formatted, group, index) => {
    if (index === 0) {
      return group;
    }

    return `${formatted}${index === 1 ? " " : "-"}${group}`;
  }, "");
}

export function createChatFromPhone(phoneDigits: string): Chat | null {
  if (!/^\d{10}$/.test(phoneDigits)) {
    return null;
  }

  const phone = `7${phoneDigits}`;

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
