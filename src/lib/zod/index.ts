import { tryCatch } from "@/lib/utils/tryCatch";
import { z } from "zod";

export const httpsURLSchema = z
  .string()
  .trim()
  .url()
  .refine((url) => url.startsWith("https://"), "URL must start with https://");

export const dgkURLSchema = z
  .string()
  .trim()
  .url()
  .refine((str) =>
    tryCatch(() => {
      const url = new URL(str);
      return Boolean(url.protocol === "https:" && url.port);
    }, false),
  );
