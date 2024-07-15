// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useReadContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { MainnetV4GetterABI } from "@/lib/abi/mainnet/v4/getter";
import type { ExtractAbiFunction } from "abitype";
import {
  AbiInputsToParams,
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";

type Fn = ExtractAbiFunction<
  typeof MainnetV4GetterABI,
  "getOperatorDeclaredFee"
>;
const abiFunction = extractAbiFunction(
  MainnetV4GetterABI,
  "getOperatorDeclaredFee",
);

export const useGetOperatorDeclaredFee = (
  params: AbiInputsToParams<Fn["inputs"]>,
) => {
  const { getterContractAddress } = useSSVNetworkDetails();

  return useReadContract({
    abi: MainnetV4GetterABI,
    address: getterContractAddress,
    functionName: "getOperatorDeclaredFee",
    args: paramsToArray({ params, abiFunction }),
    query: {
      enabled: Boolean(params),
    },
  });
};
