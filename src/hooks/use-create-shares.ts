import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  CreateSharesMessage,
  CreateSharesResponseMessage,
} from "@/workers/create-keystore-payload";

import CreateKeystorePayloadWorker from "@/workers/create-keystore-payload?worker";
import type { KeySharesPayload } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/KeySharesPayload";
const worker = new CreateKeystorePayloadWorker();

export const createKeystorePayload = async (
  args: CreateSharesMessage["data"],
): Promise<KeySharesPayload> => {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e: CreateSharesResponseMessage) => {
      const { data, error } = e.data;
      return data ? resolve(data) : reject(error);
    };
    worker.postMessage(args);
  });
};

export const useCreateShares = (
  options: MutationConfig<typeof createKeystorePayload> = {},
) => {
  return useMutation({
    mutationFn: createKeystorePayload,
    ...options,
  });
};
