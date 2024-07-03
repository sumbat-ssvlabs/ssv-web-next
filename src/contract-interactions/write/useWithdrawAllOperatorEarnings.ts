// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/useSSVNetworkDetails";
import { MainnetV4SetterABI } from "@/abi/mainnet/v4/setter";
import type {
  ExtractAbiFunction,
  AbiParametersToPrimitiveTypes,
} from "abitype";

type Fn = ExtractAbiFunction<
  typeof MainnetV4SetterABI,
  "withdrawAllOperatorEarnings"
>;

export const useWithdrawAllOperatorEarnings = () => {
  const { setterContractAddress } = useSSVNetworkDetails();
  const mutation = useWriteContract();

  const write = (args: AbiParametersToPrimitiveTypes<Fn["inputs"]>) => {
    return mutation.writeContract({
      abi: MainnetV4SetterABI,
      address: setterContractAddress,
      functionName: "withdrawAllOperatorEarnings",
      args,
    });
  };

  return {
    mutation,
    write,
  };
};
