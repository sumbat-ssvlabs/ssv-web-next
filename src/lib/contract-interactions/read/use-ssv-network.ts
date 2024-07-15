// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useReadContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { MainnetV4GetterABI } from "@/lib/abi/mainnet/v4/getter";

export const useSsvNetwork = () => {
  const { getterContractAddress } = useSSVNetworkDetails();

  return useReadContract({
    abi: MainnetV4GetterABI,
    address: getterContractAddress,
    functionName: "ssvNetwork",
  });
};
