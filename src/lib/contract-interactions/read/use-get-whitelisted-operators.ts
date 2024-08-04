// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useReadContract } from "wagmi";
import {
  getSSVNetworkDetails,
  useSSVNetworkDetails,
} from "@/hooks/use-ssv-network-details";
import { MainnetV4GetterABI } from "@/lib/abi/mainnet/v4/getter";
import type { AbiInputsToParams } from "@/lib/contract-interactions/utils";
import {
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";
import type { ExtractAbiFunction } from "abitype";
import { readContractQueryOptions } from "wagmi/query";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { queryClient } from "@/lib/react-query";

type Fn = ExtractAbiFunction<
  typeof MainnetV4GetterABI,
  "getWhitelistedOperators"
>;
const abiFunction = extractAbiFunction(
  MainnetV4GetterABI,
  "getWhitelistedOperators",
);

export const getGetWhitelistedOperatorsQueryOptions = (
  params: AbiInputsToParams<Fn["inputs"]>,
) =>
  readContractQueryOptions(config, {
    abi: MainnetV4GetterABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "getWhitelistedOperators",
    args: paramsToArray({ params, abiFunction }),
  });

export const fetchGetWhitelistedOperators = (
  params: AbiInputsToParams<Fn["inputs"]>,
) => queryClient.fetchQuery(getGetWhitelistedOperatorsQueryOptions(params));

export const useGetWhitelistedOperators = (
  params: AbiInputsToParams<Fn["inputs"]>,
) => {
  const { getterContractAddress } = useSSVNetworkDetails();

  return useReadContract({
    abi: MainnetV4GetterABI,
    address: getterContractAddress,
    functionName: "getWhitelistedOperators",
    args: paramsToArray({ params, abiFunction }),
    query: {
      enabled: Boolean(params),
    },
  });
};
