import type { QueryConfig } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const schema = z.object({
  version: z.literal("v1.1.0"),
  createdAt: z.string(),
  shares: z.array(
    z.object({
      data: z.object({
        ownerNonce: z.number(),
        ownerAddress: z.string(),
        publicKey: z.string(),
        operators: z.array(
          z.object({ id: z.number(), operatorKey: z.string() }),
        ),
      }),
      payload: z.object({
        publicKey: z.string(),
        operatorIds: z.array(z.number()),
        sharesData: z.string(),
      }),
    }),
  ),
});

export const validateKeySharesFileSchema = async (file: File) => {
  const text = await file!.text();
  const json = JSON.parse(text);
  return schema.parse(json);
};

export const useKeySharesSchemaValidation = (
  file: File | null,
  options: QueryConfig = {},
) => {
  return useQuery({
    queryKey: ["keystore-schema-validation", file],
    queryFn: () => validateKeySharesFileSchema(file!),
    retry: false,
    enabled: Boolean(file),
    ...options,
  });
};
