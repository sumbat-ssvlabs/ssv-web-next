import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  CreateKeystorePayloadMessage,
  KeystorePayloadResponseMessage,
} from "@/workers/create-keystore-payload";
import CreateKeystorePayloadWorker from "@/workers/create-keystore-payload?worker";
const worker = new CreateKeystorePayloadWorker();

export const createKeystorePayload = async (
  args: CreateKeystorePayloadMessage["data"],
) => {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e: KeystorePayloadResponseMessage) => {
      const { data, error } = e.data;
      return error ? reject(error) : resolve(data);
    };
    worker.postMessage(args);
  });
};

export const useCreateKeystorePayload = (
  options: MutationConfig<typeof createKeystorePayload> = {},
) => {
  return useMutation({
    mutationFn: createKeystorePayload,
    ...options,
  });
};
