import { type FC, type ComponentPropsWithoutRef, useState } from "react";
import { cn } from "@/lib/utils/tw";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Paperclip } from "lucide-react";
import { useKeysharesSchemaValidation } from "@/hooks/keyshares/use-keyshares-schema-validation";
import { useKeysharesValidatorsValidation } from "@/hooks/keyshares/use-keyshares-validators-validation";
import { useKeysharesOperatorsValidation } from "@/hooks/keyshares/use-keyshares-operators-validation";

export type GenerateKeySharesOfflineProps = {
  // TODO: Add props or remove this type
};

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

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof GenerateKeySharesOfflineProps> &
    GenerateKeySharesOfflineProps
>;

export const GenerateKeySharesOffline: FCProps = ({ className, ...props }) => {
  const [files, setFiles] = useState<File[]>([]);

  const { data: keyshares } = useKeysharesSchemaValidation(files[0]);
  const operatorValidation = useKeysharesOperatorsValidation({ keyshares });
  const validatorValidation = useKeysharesValidatorsValidation(keyshares);

  console.log("validatorValidation:", validatorValidation.status);
  console.log("validatorValidation.error:", validatorValidation.error);
  console.log("operatorValidation:", operatorValidation.status);
  console.log("operatorValidation.error:", operatorValidation.error);
  return (
    <div className={cn(className)} {...props}>
      {operatorValidation.isLoading && <div> operators...</div>}
      {operatorValidation.isSuccess && <div>✅ operators...</div>}
      {operatorValidation.isError && <div>❌ operators...</div>}
      {validatorValidation.isLoading && <div> validators...</div>}
      {validatorValidation.isSuccess && <div>✅ validators...</div>}
      {validatorValidation.isError && <div>❌ validators...</div>}
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
          setFiles(files || []);
        }}
        className="relative bg-background rounded-lg p-2"
      >
        <FileInput className="outline-dashed outline-1 outline-white">
          <FileSvgDraw />
          <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full "></div>
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
    </div>
  );
};

GenerateKeySharesOffline.displayName = "GenerateKeySharesOffline";
