// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type {
  MainnetEvent,
  MutationOptions,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useWaitForTransactionReceipt } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import type { WriteContractErrorType } from "@wagmi/core";
import type { WaitForTransactionReceiptErrorType } from "viem";

// type State = "idle" | "confirming" | "mining" | "mined" | "error";

export const useRenounceOwnership = () => {
  const { setterContractAddress } = useSSVNetworkDetails();

  const wait = useWaitForTransactionReceipt();
  const mutation = useWriteContract();

  const write = (options: MutationOptions<MainnetEvent> = {}) => {
    return mutation
      .writeContractAsync(
        {
          abi: MainnetV4SetterABI,
          address: setterContractAddress,
          functionName: "renounceOwnership",
        },
        {
          onSuccess: (hash) => options.onConfirmed?.(hash),
          onError: (error) =>
            options.onError?.(error as WriteContractErrorType),
        },
      )
      .then((result) =>
        wait.mutateAsync(result, {
          onSuccess: (receipt) => options.onMined?.(receipt),
          onError: (error) =>
            options.onError?.(error as WaitForTransactionReceiptErrorType),
        }),
      );
  };

  const isPending = mutation.isPending || wait.isPending;

  return {
    error: mutation.error || wait.error,
    isPending,
    mutation,
    write,
  };
};
