// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/useSSVNetworkDetails";
import { HoleskyV4SetterABI } from "@/abi/holesky/v4/setter";
import type {
  ExtractAbiFunction,
  AbiParametersToPrimitiveTypes,
} from "abitype";

type Fn = ExtractAbiFunction<
  typeof HoleskyV4SetterABI,
  "removeOperatorsWhitelistingContract"
>;

export const useRemoveOperatorsWhitelistingContract_Testnet = () => {
  const { setterContractAddress } = useSSVNetworkDetails();
  const mutation = useWriteContract();

  const write = (args: AbiParametersToPrimitiveTypes<Fn["inputs"]>) => {
    return mutation.writeContract({
      abi: HoleskyV4SetterABI,
      address: setterContractAddress,
      functionName: "removeOperatorsWhitelistingContract",
      args,
    });
  };

  return {
    mutation,
    write,
  };
};
