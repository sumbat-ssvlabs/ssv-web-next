import { deepSignal } from "@deepsignal/react";
import { effect } from "@preact/signals-react";
import type { ExtractedKeys } from "ssv-keys/dist/tsc/src/lib/SSVKeys";

type CreateClusterFlow = {
  selectedOperatorIds: number[];
  keystoreFile: File | null;
  password: string;
  extractedKeys: ExtractedKeys;
};

export const createValidatorFlow = deepSignal<CreateClusterFlow>({
  keystoreFile: null,
  selectedOperatorIds: [],
  password: "",
  extractedKeys: {
    publicKey: "",
    privateKey: "",
  },
});

effect(() => {
  console.log("createValidatorFlow", createValidatorFlow.value);
});
