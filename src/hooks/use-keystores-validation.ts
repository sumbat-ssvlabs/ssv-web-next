import { useIsValidatorRegistered } from "@/hooks/use-is-validator-registered";
import { useKeystoreSchemaValidation } from "@/hooks/use-keystore-schema-validation";
import { createValidatorFlow } from "@/signals/create-cluster-signals";
import { useMemo } from "react";

type Status =
  | "no-file"
  | "validating-schema"
  | "invalid-schema"
  | "fetching-validator"
  | "validator-not-registered"
  | "validator-registered"
  | "valid-schema";

export const useKeystoreValidation = (file: File | null) => {
  const validation = useKeystoreSchemaValidation(file, {
    enabled: Boolean(createValidatorFlow.keystoreFile.value),
  });

  const isRegistered = useIsValidatorRegistered(validation.data?.pubkey || "", {
    enabled: validation.isSuccess,
  });

  const state: Status = useMemo(() => {
    if (!file) return "no-file";
    if (validation.isLoading) return "validating-schema";
    if (validation.isError) return "invalid-schema";
    if (isRegistered.isLoading) return "fetching-validator";
    if (isRegistered.isError) return "validator-not-registered";
    if (isRegistered.isSuccess) return "validator-registered";
    return "valid-schema";
  }, [
    file,
    isRegistered.isError,
    isRegistered.isLoading,
    isRegistered.isSuccess,
    validation.isError,
    validation.isLoading,
  ]);

  return {
    state,
    schemaValidation: validation,
    isValidatorRegistered: isRegistered,
  };
};
