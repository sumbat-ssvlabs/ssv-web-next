import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useBalance } from "wagmi";

export const useSSVBalance = () => {
  const ssvNetworkDetails = useSSVNetworkDetails();
  return useBalance({
    address: ssvNetworkDetails?.tokenAddress,
  });
};
