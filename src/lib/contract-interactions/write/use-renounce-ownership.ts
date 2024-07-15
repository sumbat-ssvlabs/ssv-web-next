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
import type { WriteContractErrorType } from "@wagmi/core";

type WriteMutationOptions = Pick<
  UseWriteContractParameters<Config, unknown>,
  "mutation"
>;

// type State = "idle" | "confirming" | "mining" | "mined" | "error";

export const useRenounceOwnership = (
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

  const write = () => {
    return mutation.writeContract({
      abi: MainnetV4SetterABI,
      address: setterContractAddress,
      functionName: "renounceOwnership",
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
