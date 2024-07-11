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

type Fn = ExtractAbiFunction<typeof MainnetV4SetterABI, "upgradeTo">;
const abiFunction = extractAbiFunction(MainnetV4SetterABI, "upgradeTo");

export const useUpgradeTo = () => {
  const { setterContractAddress } = useSSVNetworkDetails();
  const mutation = useWriteContract();

  const write = (params: AbiInputsToParams<Fn["inputs"]>) => {
    return mutation.writeContract({
      abi: MainnetV4SetterABI,
      address: setterContractAddress,
      functionName: "upgradeTo",
      args: paramsToArray({ params, abiFunction }),
    });
  };

  return {
    mutation,
    write,
  };
};
