import { MutationConfig } from "@/lib/react-query";
import { KeystoreResponseMessage } from "@/workers/extract-keystore-data";
import ExtractKeystoreDataWorker from "@/workers/extract-keystore-data?worker";
import { useMutation } from "@tanstack/react-query";
const worker = new ExtractKeystoreDataWorker();

type Params = {
  file: File;
  password: string;
};

export const extractKeys = async ({ file, password }: Params) => {
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
