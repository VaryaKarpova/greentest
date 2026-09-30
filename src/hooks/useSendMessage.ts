import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../api/greenApi";
import type { SendMessageResponse } from "../api/types";
import type { Credentials } from "../types";

export type SendMessageVariables = {
  localId: string;
  chatId: string;
  message: string;
};

type UseSendMessageOptions = {
  onSuccess: (response: SendMessageResponse, variables: SendMessageVariables) => void;
  onError: (error: Error, variables: SendMessageVariables) => void;
};

export function useSendMessage(
  credentials: Credentials,
  { onSuccess, onError }: UseSendMessageOptions,
) {
  return useMutation({
    mutationFn: ({ chatId, message }: SendMessageVariables) =>
      sendMessage(credentials, { chatId, message }),
    onSuccess,
    onError,
    retry: false,
  });
}
