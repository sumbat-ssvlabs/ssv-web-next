import { KeysharesErrorAlert } from "@/components/keyshares/keyshares-error-alert";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CopyBtn } from "@/components/ui/copy-btn";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/grid-table";
import { Input } from "@/components/ui/input";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Spacer } from "@/components/ui/spacer";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import {
  useRegisterValidatorContext,
  useSelectedOperatorIds,
} from "@/guard/register-validator-guard";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useKeysharesValidation } from "@/hooks/keyshares/use-keyshares-validation";
import { useKeysharesValidatorsList } from "@/hooks/keyshares/use-keyshares-validators-state-validation";
import { useOperatorsUsability } from "@/hooks/keyshares/use-operators-usability";
import { createClusterHash } from "@/lib/utils/cluster";
import { shortenAddress } from "@/lib/utils/strings";
import { cn } from "@/lib/utils/tw";
import { Paperclip } from "lucide-react";
import { useEffect, type ComponentPropsWithoutRef, type FC } from "react";
import { useNavigate } from "react-router";
import { ref } from "valtio";
import { useAccount } from "@/hooks/account/use-account";

export type GenerateKeySharesOfflineProps = {
  // TODO: Add props or remove this type
};

const FileSvgDraw = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <div className="flex flex-col items-center pt-8">
      {isLoading && <Spinner />}
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
    </div>
  );
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof GenerateKeySharesOfflineProps> &
    GenerateKeySharesOfflineProps
>;

export const UploadKeyshares: FCProps = ({ ...props }) => {
  const account = useAccount();
  const navigate = useNavigate();

  const { state } = useRegisterValidatorContext;
  const context = useRegisterValidatorContext();

  const validatedShares = useKeysharesValidation(context.files?.at(0) || null);
  const operatorIds = useSelectedOperatorIds();

  const validators = useKeysharesValidatorsList(validatedShares.data, {
    enabled: validatedShares.isSuccess,
  });

  useEffect(() => {
    if (state.selectedValidatorsCount < 1) {
      state.selectedValidatorsCount = validators.data?.tags.valid.length ?? 0;
    }
  }, [state, validators.data?.tags.valid.length]);

  const cluster = useCluster(createClusterHash(account.address!, operatorIds));

  const operatorsUsability = useOperatorsUsability(
    {
      account: account.address!,
      operatorIds,
      additionalValidators: validators.data?.tags?.valid.length,
    },
    { enabled: validatedShares.isSuccess },
  );

  const submit = () => {
    state.shares =
      validators.data?.tags.valid
        .slice(0, context.selectedValidatorsCount)
        .map((share) => share.payload) || [];

    if (cluster.data)
      return navigate(`/join/validator/${cluster.data.clusterId}/funding`);
    navigate("../funding");
  };

  const canProceed =
    Boolean(validators.data?.tags?.valid.length) &&
    !operatorsUsability.data?.hasExceededValidatorsLimit &&
    !operatorsUsability.data?.hasPermissionedOperators &&
    context.selectedValidatorsCount > 0;

  return (
    <Container
      variant="vertical"
      size={validators.data?.sharesWithStatuses?.length ? "xl" : "default"}
      className="h-full py-6"
    >
      <NavigateBackBtn by="history" />
      <div className="flex gap-6 w-full">
        <Card className="flex-1 h-fit" {...props}>
          <Text variant="headline4">Enter KeyShares File</Text>
          <FileUploader
            dropzoneOptions={{
              maxFiles: 1,
              maxSize: 1024 * 1024 * 4,
              multiple: false,
              accept: {
                "application/json": [".json"],
              },
            }}
            value={context.files as File[]}
            onValueChange={(files) => {
              state.files = files ? ref(files) : null;
            }}
            className="relative bg-background rounded-lg p-2"
          >
            <FileInput className="outline-dashed outline-1 outline-white">
              <FileSvgDraw
                isLoading={validatedShares.isLoading || validators.isLoading}
              />
              <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full px-3 "></div>
            </FileInput>
            <FileUploaderContent>
              {context.files &&
                context.files.length > 0 &&
                context.files.map((file, i) => (
                  <FileUploaderItem key={i} index={i}>
                    <Paperclip className="h-4 w-4 stroke-current" />
                    <span>{file.name}</span>
                  </FileUploaderItem>
                ))}
            </FileUploaderContent>
          </FileUploader>
          <KeysharesErrorAlert error={validatedShares.error} />

          {validators.data?.sharesWithStatuses && (
            <div className="space-y-2">
              <Text variant="body-3-medium" className="text-gray-500">
                Keyshares Summary
              </Text>
              <div className="flex items-center w-full gap-2 justify-between">
                <Text variant="body-2-medium">Validators</Text>
                <Text variant="body-2-medium">
                  {validators.data?.sharesWithStatuses?.length}
                </Text>
              </div>
              <div className="flex gap-2">
                <Text variant="body-2-medium" className="pr-2">
                  Operators
                </Text>
                <Spacer />
                {operatorsUsability.data?.operators?.map(
                  ({ operator, isUsable }) => (
                    <div
                      className="flex flex-1 max-w-8 flex-col items-center"
                      key={operator.id}
                    >
                      <OperatorAvatar
                        variant="circle"
                        src={operator.logo}
                        className={cn("border", {
                          "border-error-500": !isUsable,
                          "border-transparent": isUsable,
                        })}
                      />
                      <Text
                        className={cn("text-[10px] text-gray-500 font-medium", {
                          "text-error-500": !isUsable,
                        })}
                      >
                        ID:{operator.id.toString()}
                      </Text>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {operatorsUsability.data?.hasPermissionedOperators && (
            <Alert variant="warning">
              <AlertDescription>
                One of your chosen operators is a permissioned operator. Please
                select an alternative operator.
              </AlertDescription>
            </Alert>
          )}
        </Card>
        {Boolean(validators.data?.sharesWithStatuses?.length) && (
          <Card className="flex-1">
            <div className="flex items-center gap-1 justify-between">
              <Text variant="headline4" className="flex-1">
                Selected Validators
              </Text>
              <div className="flex items-center gap-1 justify-between">
                <Button
                  disabled={context.selectedValidatorsCount <= 1}
                  variant="secondary"
                  onClick={() => state.selectedValidatorsCount--}
                >
                  -
                </Button>
                <Input
                  className="w-16"
                  value={context.selectedValidatorsCount}
                  onChange={(ev) => {
                    const value = ev.target.value;
                    if (/^\d+$/.test(value)) {
                      const number = Number(value);
                      if (
                        number > (validators.data?.tags?.valid?.length ?? 0)
                      ) {
                        state.selectedValidatorsCount =
                          validators.data?.tags?.valid?.length ?? 0;
                      } else {
                        state.selectedValidatorsCount = number;
                      }
                    }
                  }}
                />
                <Button
                  disabled={
                    context.selectedValidatorsCount ===
                    (validators.data?.tags?.valid?.length ?? 0)
                  }
                  onClick={() => state.selectedValidatorsCount++}
                  variant="secondary"
                >
                  +
                </Button>
              </div>
            </div>
            {Boolean(validators.data?.tags?.["incorrect-nonce"].length) && (
              <Alert variant="error">
                <AlertDescription>
                  Validators within this file have an incorrect{" "}
                  <Button
                    as="a"
                    variant="link"
                    target="_blank"
                    href="https://docs.ssv.network/developers/tools/cluster-scanner#_x7nzjlwu00d0"
                  >
                    registration nonce
                  </Button>
                  . Please split the validator keys to new key shares aligned
                  with the correct one.
                </AlertDescription>
              </Alert>
            )}
            <Table
              gridTemplateColumns="1fr auto"
              className="flex-1 max-h-[580px]"
            >
              <TableHeader className="sticky z-10 top-0 bg-gray-50">
                <TableCell>Public key</TableCell>
                <TableCell>Status</TableCell>
              </TableHeader>
              {(() => {
                let selectedValidatorsCount = 0;

                return validators.data?.sharesWithStatuses?.map((validator) => {
                  const selected =
                    validator.status === "valid" &&
                    selectedValidatorsCount < context.selectedValidatorsCount;
                  if (selected) selectedValidatorsCount++;
                  return (
                    <TableRow
                      key={validator.share.data.publicKey}
                      className={cn({
                        "bg-primary-50 font-bold border border-primary-500":
                          selected,
                      })}
                    >
                      <TableCell className="flex gap-1 items-center">
                        <Text>
                          {shortenAddress(validator.share.payload.publicKey)}
                        </Text>
                        <CopyBtn
                          className="z-0"
                          text={validator.share.payload.publicKey}
                        />
                      </TableCell>
                      <TableCell>
                        {validator.status !== "valid" && (
                          <Badge
                            size="sm"
                            variant={
                              validator.status === "registered"
                                ? "success"
                                : "error"
                            }
                          >
                            {validator.status}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                });
              })()}
            </Table>
            <Button
              isLoading={cluster.isLoading}
              size="xl"
              onClick={submit}
              disabled={!canProceed}
            >
              Next
            </Button>
          </Card>
        )}
      </div>
    </Container>
  );
};

UploadKeyshares.displayName = "GenerateKeySharesOffline";
