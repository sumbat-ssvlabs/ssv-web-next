import { getOwnerNonce } from "@/api/account";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import {
  useRegisterValidatorContext,
  useSelectedOperatorIds,
} from "@/guard/register-validator-guard";
import { useOperators } from "@/hooks/operator/use-operators";
import { useCreateShares } from "@/hooks/use-create-shares";
import { useExtractKeystoreData } from "@/hooks/use-extract-keystore-data";
import { useKeystoreValidation } from "@/hooks/use-keystores-validation";
import { prepareOperatorsForShares } from "@/lib/utils/operator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ref } from "valtio";
import { useAccount } from "wagmi";
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
  const { address } = useAccount();
  const { state } = useRegisterValidatorContext;
  const { files, password } = useRegisterValidatorContext();

  const navigate = useNavigate();

  const { status } = useKeystoreValidation(files?.[0] as File);
  const createShares = useCreateShares();

  const operatorsIds = useSelectedOperatorIds();
  const operators = useOperators(operatorsIds);

  const extractKeystoreData = useExtractKeystoreData({
    onSuccess: async (data) => {
      const nonce = await getOwnerNonce(address!);

      const shares = await createShares.mutateAsync({
        account: address!,
        nonce: nonce,
        operators: prepareOperatorsForShares(operators.data!),
        privateKey: data.privateKey,
      });

      state.shares = [shares];
      navigate("../funding");
    },
  });

  const form = useForm({
    defaultValues: { password },
    resolver: zodResolver(schema),
  });

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Card className="flex flex-col w-full">
        <FileUploader
          dropzoneOptions={{
            maxFiles: 1,
            maxSize: 1024 * 1024 * 4,
            multiple: false,
            accept: {
              "application/json": [".json"],
            },
          }}
          value={files as File[]}
          onValueChange={(files) => {
            state.files = files ? ref(files) : null;
          }}
          className="relative bg-background rounded-lg p-2"
        >
          <FileInput className="outline-dashed outline-1 outline-white">
            <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
              <FileSvgDraw />{" "}
              {status !== "no-file" && (
                <div className="text-red-500 text-xl mt-2">{status}</div>
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
            state.password = data.password;
            await extractKeystoreData.mutateAsync({
              file: files![0],
              password: data.password,
            });
          })}
        >
          <Input
            defaultValue={password}
            disabled={status !== "validator-not-registered"}
            type="password"
            className="mt-4"
            {...form.register("password")}
          />
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {extractKeystoreData.error?.message}
          </div>
          <Button
            size="xl"
            type="submit"
            disabled={
              status !== "validator-not-registered" ||
              !form.watch("password").length
            }
            isLoading={extractKeystoreData.isPending || operators.isPending}
          >
            Generate Key Shares
          </Button>
        </form>
      </Card>
    </Container>
  );
};

GenerateKeySharesOnline.displayName = "GenerateKeySharesOnline";
