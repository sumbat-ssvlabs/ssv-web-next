// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/lib/hooks/useSSVNetworkDetails";
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
  options?: MutationOptions<MainnetEvent>,
) => {
  const { setterContractAddress } = useSSVNetworkDetails();

  const wait = useWaitForTransactionReceipt();
  const mutation = useWriteContract({
    mutation: {
      onSuccess: (result) => {
        wait.mutate(result, {
          onSuccess: (receipt) => {
            options?.onMined?.(receipt);
          },
        });
        options?.onConfirmed?.(result);
      },
      onError: (error) =>
        options?.onConfirmationError?.(error as WriteContractErrorType),
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
    isLoading,
    mutation,
    write,
  };
};
