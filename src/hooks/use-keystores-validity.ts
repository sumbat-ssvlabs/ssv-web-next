import { useIsValidatorRegistered } from "@/hooks/use-is-validator-registered";
import { useKeystoreSchemaValidation } from "@/hooks/use-keystore-schema-validation";
import { createClusterFlow } from "@/signals/create-cluster-signals";
import { useMemo } from "react";

type Status =
  | "no-file"
  | "validating-schema"
  | "invalid-schema"
  | "checking-validator-registration"
  | "validator-not-registered"
  | "validator-registered"
  | "valid-schema";

export const useKeystoreValidation = (file: File | null) => {
  const validation = useKeystoreSchemaValidation(file, {
    enabled: Boolean(createClusterFlow.keystoreFile.value),
  });

  const isValidatorRegistered = useIsValidatorRegistered(
    validation.data?.pubkey || "",
    {
      enabled: validation.isSuccess,
    },
  );

  const state: Status = useMemo(() => {
    if (!file) return "no-file";
    if (validation.isLoading) return "validating-schema";
    if (validation.isError) return "invalid-schema";
    if (isValidatorRegistered.isLoading)
      return "checking-validator-registration";
    if (isValidatorRegistered.isError) return "validator-not-registered";
    if (isValidatorRegistered.isSuccess) return "validator-registered";
    return "valid-schema";
  }, [
    file,
    isValidatorRegistered.isError,
    isValidatorRegistered.isLoading,
    isValidatorRegistered.isSuccess,
    validation.isError,
    validation.isLoading,
  ]);

  return {
    state,
    schemaValidation: validation,
    isValidatorRegistered,
  };
};
