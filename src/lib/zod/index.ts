import { tryCatch } from "@/lib/utils/tryCatch";
import { z } from "zod";

const protocolRegex = /^(http|https?:\/\/)/;
export const httpsURLSchema = z
  .string()
  .trim()
  .transform<string>((url) =>
    !protocolRegex.test(url) ? `https://${url}` : url,
  )
  .pipe(z.string().url("Invalid URL"));

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
