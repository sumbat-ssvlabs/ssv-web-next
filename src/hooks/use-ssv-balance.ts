import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useBalance, useAccount } from "wagmi";

export const useSSVBalance = () => {
  const ssvNetworkDetails = useSSVNetworkDetails();
  const { address } = useAccount();

  return useBalance({
    address,
    token: ssvNetworkDetails?.tokenAddress,
  });
};
