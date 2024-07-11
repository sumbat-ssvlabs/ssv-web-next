import { HoleskyV4SetterABI } from "@/lib/abi/holesky/v4/setter";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import { useMutation } from "@tanstack/react-query";
import { decodeEventLog, DecodeEventLogReturnType } from "viem";
import { usePublicClient } from "wagmi";

type MainnetEvents = DecodeEventLogReturnType<typeof MainnetV4SetterABI>;
type TestnetEvents = DecodeEventLogReturnType<typeof HoleskyV4SetterABI>;

export const useWaitForTransactionReceipt = () => {
  const client = usePublicClient();
  return useMutation({
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
        }, [] as MainnetEvents[]),
      }));
    },
  });
};

export const useWaitForTransactionReceipt_Testnet = () => {
  const client = usePublicClient();
  return useMutation({
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
        }, [] as TestnetEvents[]),
      }));
    },
  });
};
