import type { Address } from "abitype";
import { useMemo } from "react";
import { useLocalStorage } from "react-use";
import { isAddress } from "viem";
import type { Config, UseAccountReturnType } from "wagmi";
import { useAccount as useWagmiAccount } from "wagmi";

export const useAccount = () => {
  const account = useWagmiAccount();

  const [testWalletAddress] = useLocalStorage<Address>(
    "testWalletAddress",
    undefined,
    { raw: true },
  );

  return useMemo(
    () =>
      ({
        ...account,
        address: isAddress(testWalletAddress ?? "")
          ? testWalletAddress
          : account.address,
      }) as UseAccountReturnType<Config>,
    [testWalletAddress, account],
  );
};
