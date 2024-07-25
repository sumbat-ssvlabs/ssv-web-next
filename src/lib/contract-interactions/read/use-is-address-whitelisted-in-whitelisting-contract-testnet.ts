// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useReadContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { HoleskyV4GetterABI } from "@/lib/abi/holesky/v4/getter";
import type { ExtractAbiFunction } from "abitype";
import type { AbiInputsToParams } from "@/lib/contract-interactions/utils";
import {
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";

type Fn = ExtractAbiFunction<
  typeof HoleskyV4GetterABI,
  "isAddressWhitelistedInWhitelistingContract"
>;
const abiFunction = extractAbiFunction(
  HoleskyV4GetterABI,
  "isAddressWhitelistedInWhitelistingContract",
);

export const useIsAddressWhitelistedInWhitelistingContract_Testnet = (
  params: AbiInputsToParams<Fn["inputs"]>,
) => {
  const { getterContractAddress } = useSSVNetworkDetails();

  return useReadContract({
    abi: HoleskyV4GetterABI,
    address: getterContractAddress,
    functionName: "isAddressWhitelistedInWhitelistingContract",
    args: paramsToArray({ params, abiFunction }),
    query: {
      enabled: Boolean(params),
    },
  });
};
