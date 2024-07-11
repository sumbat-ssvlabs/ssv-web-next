// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/lib/hooks/useSSVNetworkDetails";
import { HoleskyV4SetterABI } from "@/lib/abi/holesky/v4/setter";
import type { ExtractAbiFunction } from "abitype";
import {
  AbiInputsToParams,
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";

type Fn = ExtractAbiFunction<typeof HoleskyV4SetterABI, "registerOperator">;
const abiFunction = extractAbiFunction(HoleskyV4SetterABI, "registerOperator");

export const useRegisterOperator_Testnet = () => {
  const { setterContractAddress } = useSSVNetworkDetails();
  const mutation = useWriteContract();

  const write = (params: AbiInputsToParams<Fn["inputs"]>) => {
    return mutation.writeContract({
      abi: HoleskyV4SetterABI,
      address: setterContractAddress,
      functionName: "registerOperator",
      args: paramsToArray({ params, abiFunction }),
    });
  };

  return {
    mutation,
    write,
  };
};
