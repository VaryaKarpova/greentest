export type Credentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type Chat = {
  phone: string;
  chatId: string;
};

export type MessageStatus = "sending" | "sent" | "error";

export type Message = {
  id: string;
  idMessage?: string;
  text: string;
  timestamp: number;
  direction: "incoming" | "outgoing";
  status: MessageStatus;
  error?: string;
};
