import { useMemo } from "react";
import { useAccount } from "wagmi";

export const useLinks = () => {
  const { chain } = useAccount();
  return useMemo(() => {
    const prefix = chain?.testnet ? `${chain.name.toLowerCase()}.` : "";
    return {
      beaconcha: `https://${prefix}beaconcha.in`,
      launchpad: `https://${prefix}launchpad.ethereum.org`,
      etherscan: `https://${prefix}etherscan.io`,
    };
  }, [chain?.name, chain?.testnet]);
};
