// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { Config, useWriteContract, UseWriteContractParameters } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import {
  MainnetEvent,
  MutationOptions,
  useWaitForTransactionReceipt,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import type { ExtractAbiFunction } from "abitype";
import {
  AbiInputsToParams,
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";
import type { WriteContractErrorType } from "@wagmi/core";

type WriteMutationOptions = Pick<
  UseWriteContractParameters<Config, unknown>,
  "mutation"
>;
type Fn = ExtractAbiFunction<
  typeof MainnetV4SetterABI,
  "updateMaximumOperatorFee"
>;
const abiFunction = extractAbiFunction(
  MainnetV4SetterABI,
  "updateMaximumOperatorFee",
);
// type State = "idle" | "confirming" | "mining" | "mined" | "error";

export const useUpdateMaximumOperatorFee = (
  options?: MutationOptions<MainnetEvent> & WriteMutationOptions,
) => {
  const { setterContractAddress } = useSSVNetworkDetails();

  const wait = useWaitForTransactionReceipt();
  const mutation = useWriteContract({
    mutation: {
      ...options?.mutation,
      onSuccess: (result, ...rest) => {
        options?.mutation?.onSuccess?.(result, ...rest);
        wait.mutate(result, {
          onSuccess: (receipt) => {
            options?.onMined?.(receipt);
          },
        });
        options?.onConfirmed?.(result);
      },
      onError: (error, ...rest) => {
        options?.mutation?.onError?.(error, ...rest);
        options?.onConfirmationError?.(error as WriteContractErrorType);
      },
    },
  });

  const write = (params: AbiInputsToParams<Fn["inputs"]>) => {
    return mutation.writeContract({
      abi: MainnetV4SetterABI,
      address: setterContractAddress,
      functionName: "updateMaximumOperatorFee",
      args: paramsToArray({ params, abiFunction }),
    });
  };

  const isLoading = mutation.isPending || wait.isPending;

  return {
    error: mutation.error || wait.error,
    isLoading,
    mutation,
    write,
  };
};
