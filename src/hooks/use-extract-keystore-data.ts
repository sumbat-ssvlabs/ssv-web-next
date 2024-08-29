import type { MutationConfig } from "@/lib/react-query";
import type { KeystoreResponseMessage } from "@/workers/extract-keystore-data";
import { useMutation } from "@tanstack/react-query";

import ExtractKeystoreDataWorker from "@/workers/extract-keystore-data?worker";
import type { ExtractedKeys } from "ssv-keys/dist/tsc/src/lib/SSVKeys";
console.log("ExtractKeystoreDataWorker:", ExtractKeystoreDataWorker);
const worker = new ExtractKeystoreDataWorker();

type Params = {
  file: File;
  password: string;
};

export const extractKeys = async ({
  file,
  password,
}: Params): Promise<ExtractedKeys> => {
  console.log("worker:", worker);
  return new Promise((resolve, reject) => {
    worker.onmessage = (e: KeystoreResponseMessage) => {
      const { data, error } = e.data;
      console.log("data:", data);
      return error ? reject(error) : resolve(data);
    };
    console.log("worker.postMessage:", worker.postMessage);
    worker.postMessage({ file, password });
  });
};

export const useExtractKeystoreData = (
  options: MutationConfig<typeof extractKeys> = {},
) => {
  return useMutation({
    mutationFn: extractKeys,
    ...options,
  });
};
