import { useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { useMemo } from "react";
import { useLocalStorage } from "react-use";
import { isAddress } from "viem";
import type { Config, UseAccountReturnType } from "wagmi";
import { usePublicClient, useAccount as useWagmiAccount } from "wagmi";

export const useAccount = () => {
  const account = useWagmiAccount();
  const publicClient = usePublicClient();

  const [testWalletAddress] = useLocalStorage<Address>(
    "testWalletAddress",
    undefined,
    { raw: true },
  );

  const accountAddress = useMemo(() => {
    if (isAddress(testWalletAddress ?? "")) {
      return testWalletAddress;
    }
    return account.address;
  }, [testWalletAddress, account]);

  const isContract = useQuery({
    staleTime: Infinity,
    queryKey: ["is-contract", accountAddress],
    queryFn: async () => {
      const code = await publicClient!.getCode({
        address: accountAddress!,
      });
      return code !== "0x";
    },
    enabled: !!accountAddress && !!publicClient,
  });

  return useMemo(
    () =>
      ({
        ...account,
        address: accountAddress,
        isContract: isContract.data ?? false,
      }) as UseAccountReturnType<Config> & { isContract: boolean },
    [account, accountAddress, isContract.data],
  );
};
