import { tryCatch } from "@/lib/utils/tryCatch";
import { z } from "zod";

export const httpsURLSchema = z
  .string()
  .trim()
  .url("URL must start with https://")
  .refine((url) => url.startsWith("https://"), "URL must start with https://");

export const dgkURLSchema = z
  .string()
  .trim()
  .url("URL must start with https://")
  .refine(
    (str) =>
      tryCatch(() => {
        const url = new URL(str);
        return Boolean(url.protocol === "https:" && url.port);
      }, false),
    "Enter a valid IP address and port number",
  );
