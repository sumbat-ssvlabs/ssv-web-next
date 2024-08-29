import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

// import ExtractKeystoreDataWorker from "@/workers/extract-keystore-data?worker&url";
// const worker = new Worker(ExtractKeystoreDataWorker);
// console.log("ExtractKeystoreDataWorker:", ExtractKeystoreDataWorker);

const { SSVKeys } = await import("ssv-keys");
const ssvKeys = new SSVKeys();

type Params = {
  file: File;
  password: string;
};

export const extractKeys = async ({ file, password }: Params) => {
  const text = await file.text();
  console.log("text:", text);
  console.log("ssvKeys:", ssvKeys);

  return ssvKeys.extractKeys(text, password);
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
