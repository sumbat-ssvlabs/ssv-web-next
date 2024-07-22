import { MutationConfig } from "@/lib/react-query";
import { KeystoreResponseMessage } from "@/workers/extract-keystore-data";
import { useMutation } from "@tanstack/react-query";

import ExtractKeystoreDataWorker from "@/workers/extract-keystore-data?worker";
import { ExtractedKeys } from "ssv-keys/dist/tsc/src/lib/SSVKeys";
const worker = new ExtractKeystoreDataWorker();

type Params = {
  file: File;
  password: string;
};

export const extractKeys = async ({
  file,
  password,
}: Params): Promise<ExtractedKeys> => {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e: KeystoreResponseMessage) => {
      const { data, error } = e.data;
      return error ? reject(error) : resolve(data);
    };
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
