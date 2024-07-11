// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/lib/hooks/useSSVNetworkDetails";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import type { ExtractAbiFunction } from "abitype";
import {
  AbiInputsToParams,
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";

type Fn = ExtractAbiFunction<typeof MainnetV4SetterABI, "executeOperatorFee">;
const abiFunction = extractAbiFunction(
  MainnetV4SetterABI,
  "executeOperatorFee",
);

export const useExecuteOperatorFee = () => {
  const { setterContractAddress } = useSSVNetworkDetails();
  const mutation = useWriteContract();

  const write = (params: AbiInputsToParams<Fn["inputs"]>) => {
    return mutation.writeContract({
      abi: MainnetV4SetterABI,
      address: setterContractAddress,
      functionName: "executeOperatorFee",
      args: paramsToArray({ params, abiFunction }),
    });
  };

  return {
    mutation,
    write,
  };
};
