import type { QueryConfig } from "@/lib/react-query";
import { keysharesSchema } from "@/lib/zod/keyshares";
import { useQuery } from "@tanstack/react-query";
import { KeyShares } from "ssv-keys";

export const validateKeysharesFile = async (file: File) => {
  const text = await file!.text();
  const json = JSON.parse(text);
  keysharesSchema.parse(json);
  return (await KeyShares.fromJson(json)).list();
};

export const useKeysharesSchemaValidation = (
  file: File | null,
  options: QueryConfig = {},
) => {
  return useQuery({
    queryKey: ["keyshares-schema-validation", file],
    queryFn: () => validateKeysharesFile(file!),
    retry: false,
    enabled: Boolean(file),
    ...options,
  });
};
