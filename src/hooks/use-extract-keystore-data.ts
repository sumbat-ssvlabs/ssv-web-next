import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

// import ExtractKeystoreDataWorker from "@/workers/extract-keystore-data?worker&url";
// const worker = new Worker(ExtractKeystoreDataWorker);
// console.log("ExtractKeystoreDataWorker:", ExtractKeystoreDataWorker);
import { SSVKeys } from "ssv-keys";
import { type ExtractedKeys } from "ssv-keys/dist/tsc/src/lib/SSVKeys";

type Params = {
  file: File;
  password: string;
};

const ssvKeys = new SSVKeys();

export const extractKeys = async ({
  file,
  password,
}: Params): Promise<ExtractedKeys> => {
  const text = await file.text();
  return await ssvKeys.extractKeys(text, password);
  // return new Promise((resolve, reject) => {
  //   worker.onmessage = (e: KeystoreResponseMessage) => {
  //     const { data, error } = e.data;
  //     console.log("data:", data);
  //     return error ? reject(error) : resolve(data);
  //   };
  //   worker.postMessage({ file, password });
  // });
};

export const useExtractKeystoreData = (
  options: MutationConfig<typeof extractKeys> = {},
) => {
  return useMutation({
    mutationFn: extractKeys,
    ...options,
  });
};
