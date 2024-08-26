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
import { TokenABI } from "@/lib/abi/token";
import type { WriteContractErrorType } from "@wagmi/core";
import type { WaitForTransactionReceiptErrorType } from "viem";

// type State = "idle" | "confirming" | "mining" | "mined" | "error";

export const useInitialize = () => {
  const { tokenAddress } = useSSVNetworkDetails();

  const wait = useWaitForTransactionReceipt(["useInitialize", tokenAddress]);
  const mutation = useWriteContract();

  const write = (options: MutationOptions<MainnetEvent> = {}) => {
    return mutation
      .writeContractAsync(
        {
          abi: TokenABI,
          address: tokenAddress,
          functionName: "initialize",
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
    isSuccess: wait.isSuccess,
    isPending,
    mutation,
    write,
  };
};
