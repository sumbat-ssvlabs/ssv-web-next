// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/lib/hooks/useSSVNetworkDetails";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";

export const useRenounceOwnership = () => {
  const { setterContractAddress } = useSSVNetworkDetails();
  const mutation = useWriteContract();

  const write = () => {
    return mutation.writeContract({
      abi: MainnetV4SetterABI,
      address: setterContractAddress,
      functionName: "renounceOwnership",
    });
  };

  return {
    mutation,
    write,
  };
};
