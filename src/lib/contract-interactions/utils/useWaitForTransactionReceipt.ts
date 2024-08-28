import { HoleskyV4SetterABI } from "@/lib/abi/holesky/v4/setter";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import type { MutationKey } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type {
  Address,
  DecodeEventLogReturnType,
  TransactionReceipt,
  WaitForTransactionReceiptErrorType,
} from "viem";
import { decodeEventLog } from "viem";
import { usePublicClient } from "wagmi";

import type { WriteContractErrorType } from "@wagmi/core";
import { useTransactionModal } from "@/signals/modal";
import type { Toast } from "@/components/ui/use-toast";
import { toast } from "@/components/ui/use-toast";
import { wait } from "@/lib/utils/promise";
import type { MaybePromise } from "@tanstack/react-query-persist-client";
import { isFunction } from "lodash-es";

export type MainnetEvent = DecodeEventLogReturnType<typeof MainnetV4SetterABI>;
export type TestnetEvent = DecodeEventLogReturnType<typeof HoleskyV4SetterABI>;

export type MutationOptions<T extends MainnetEvent | TestnetEvent> = {
  onConfirmed?: (hash: Address) => MaybePromise<unknown | (() => unknown)>;
  onMined?: (
    receipt: TransactionReceipt & { events: T[] },
  ) => MaybePromise<unknown | (() => unknown)>;
  onError?: (
    error: WriteContractErrorType | WaitForTransactionReceiptErrorType,
  ) => MaybePromise<unknown | (() => unknown)>;
};

export const withTransactionModal = <
  T extends MutationOptions<MainnetEvent | TestnetEvent> & {
    successToast?: Toast;
    variant?: "default" | "2-step";
  },
>(
  options?: T,
) => {
  return {
    onConfirmed: async (hash) => {
      useTransactionModal.state.open({
        hash,
        variant: options?.variant,
        step: "pending",
      });
      const fn = await options?.onConfirmed?.(hash);
      isFunction(fn) && fn();
    },
    onMined: async (receipt) => {
      const fn = await options?.onMined?.(receipt);

      useTransactionModal.state.close();
      await wait(0); // skip a react lifecycle to ensure the navigation blocker is cleared so the user can navigate away

      isFunction(fn) && fn();

      toast({
        title: "Transaction confirmed",
        description: new Date().toLocaleString(),
        ...options?.successToast,
      });
    },
    onError: async (error) => {
      const fn = await options?.onError?.(error);

      useTransactionModal.state.close();
      await wait(0); // skip a react lifecycle to ensure the navigation blocker is cleared so the user can navigate away

      isFunction(fn) && fn();

      toast({
        title: "Transaction failed",
        description:
          "shortMessage" in error
            ? error?.shortMessage
            : error?.message || "Unknown error",
        variant: "destructive",
      });
    },
  } satisfies MutationOptions<MainnetEvent | TestnetEvent>;
};

export const useWaitForTransactionReceipt = (key: MutationKey = []) => {
  const client = usePublicClient();
  return useMutation({
    mutationKey: ["waitForTransactionReceipt", ...key],
    mutationFn: (hash: `0x${string}`) => {
      if (!client) {
        throw new Error("Public client not found");
      }
      return client?.waitForTransactionReceipt({ hash }).then((receipt) => ({
        ...receipt,
        events: receipt.logs.reduce((acc, log) => {
          try {
            acc.push(
              decodeEventLog({
                abi: MainnetV4SetterABI,
                data: log.data,
                topics: log.topics,
              }),
            );
          } catch (e) {
            console.error(e);
          }
          return acc;
        }, [] as MainnetEvent[]),
      }));
    },
  });
};

export const useWaitForTransactionReceipt_Testnet = () => {
  const client = usePublicClient();
  return useMutation({
    mutationKey: ["waitForTransactionReceipt"],
    mutationFn: (hash: `0x${string}`) => {
      if (!client) {
        throw new Error("Public client not found");
      }
      return client?.waitForTransactionReceipt({ hash }).then((receipt) => ({
        ...receipt,
        events: receipt.logs.reduce((acc, log) => {
          try {
            acc.push(
              decodeEventLog({
                abi: HoleskyV4SetterABI,
                data: log.data,
                topics: log.topics,
              }),
            );
          } catch (e) {
            console.error(e);
          }
          return acc;
        }, [] as TestnetEvent[]),
      }));
    },
  });
};
