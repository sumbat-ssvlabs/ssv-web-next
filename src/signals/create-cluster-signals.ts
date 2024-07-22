import { ExtractedKeys } from "ssv-keys/dist/tsc/src/lib/SSVKeys";
import { deepSignal } from "@deepsignal/react";

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
