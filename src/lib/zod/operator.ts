import { z } from "zod";

export const ALLOWED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

export const operatorLogoSchema = z.preprocess(
  (val) => {
    if (val instanceof FileList) return val[0];
    return undefined;
  },
  z
    .instanceof(File)
    .refine((file) => {
      return Boolean(
        file && file.type && ALLOWED_IMAGE_TYPES.includes(file.type),
      );
    }, "No good")
    .refine(
      (file) => file && file?.size <= 1024 * 200,
      "File size must be less than 200KB",
    )
    .transform(async (file) => {
      if (!file) return;
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      return base64;
    })
    .refine(async (base64) => {
      if (!base64) return true;
      const img = new Image();
      img.src = base64;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      return img.width > 400 && img.height > 400;
    }, "Image must be at least 400x400px"),
);
