import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { useExtractKeystoreData } from "@/hooks/use-extract-keystore-data";
import { useKeystoreValidation } from "@/hooks/use-keystores-validation";
import { createValidatorFlow } from "@/signals/create-cluster-signals";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export type GenerateKeySharesOnlineProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof GenerateKeySharesOnlineProps> &
    GenerateKeySharesOnlineProps
>;
const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const GenerateKeySharesOnline: FCProps = () => {
  const file = createValidatorFlow.keystoreFile.value;
  const files = file ? [file] : null;

  const navigate = useNavigate();

  const { state } = useKeystoreValidation(
    createValidatorFlow.keystoreFile.value,
  );

  const extractKeystoreData = useExtractKeystoreData({
    onSuccess: (data) => {
      createValidatorFlow.extractedKeys.value = data;
      navigate("/create-cluster/funding");
    },
  });

  const form = useForm({
    defaultValues: { password: "" },
    resolver: zodResolver(schema),
  });

  return (
    <Card className="flex flex-col">
      <FileUploader
        dropzoneOptions={{
          maxFiles: 1,
          maxSize: 1024 * 1024 * 4,
          multiple: false,
          accept: {
            "application/json": [".json"],
          },
        }}
        value={file ? [file] : []}
        onValueChange={(files) => {
          return (createValidatorFlow.keystoreFile.value =
            files?.at(-1) ?? null);
        }}
        className="relative bg-background rounded-lg p-2"
      >
        <FileInput className="outline-dashed outline-1 outline-white">
          <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
            <FileSvgDraw />{" "}
            {state !== "no-file" && (
              <div className="text-red-500 text-xl mt-2">{state}</div>
            )}
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(async (data) => {
          createValidatorFlow.password.value = data.password;
          await extractKeystoreData.mutateAsync({
            file: files![0],
            password: data.password,
          });
        })}
      >
        <Input
          defaultValue={createValidatorFlow.password.value}
          disabled={state !== "validator-not-registered"}
          type="password"
          className="mt-4"
          {...form.register("password")}
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {extractKeystoreData.error?.message}
        </div>
        <Button
          type="submit"
          disabled={
            state !== "validator-not-registered" ||
            !form.watch("password").length
          }
          isLoading={extractKeystoreData.isPending}
        >
          Generate Key Shares
        </Button>
      </form>
    </Card>
  );
};

GenerateKeySharesOnline.displayName = "GenerateKeySharesOnline";
