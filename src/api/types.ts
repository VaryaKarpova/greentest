export type SendMessageRequest = {
  chatId: string;
  message: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

export type GenericNotificationBody = {
  typeWebhook?: unknown;
  [key: string]: unknown;
};

export type IncomingTextNotificationBody = {
  typeWebhook: "incomingMessageReceived";
  timestamp: number;
  idMessage: string;
  senderData: {
    chatId: string;
    chatType: "user" | string;
    senderPhoneNumber: number | string;
  };
  messageData: {
    typeMessage: "textMessage";
    textMessageData: {
      textMessage: string;
    };
  };
};

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: GenericNotificationBody;
};

export type DeleteNotificationResponse = {
  result: boolean;
  reason: string;
};

export type IncomingTextMessage = {
  idMessage: string;
  chatId: string;
  senderPhoneNumber: string;
  timestamp: number;
  text: string;
};
