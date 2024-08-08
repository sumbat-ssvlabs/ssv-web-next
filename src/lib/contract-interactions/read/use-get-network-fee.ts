// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------

import type { UseReadContractParameters } from "wagmi";
import { useReadContract } from "wagmi";

import {
  getSSVNetworkDetails,
  useSSVNetworkDetails,
} from "@/hooks/use-ssv-network-details";
import { MainnetV4GetterABI } from "@/lib/abi/mainnet/v4/getter";

import { readContractQueryOptions } from "wagmi/query";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { queryClient } from "@/lib/react-query";

export const getGetNetworkFeeQueryOptions = () =>
  readContractQueryOptions(config, {
    abi: MainnetV4GetterABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "getNetworkFee",
  });

type QueryOptions = UseReadContractParameters<
  typeof MainnetV4GetterABI,
  "getNetworkFee"
>["query"];

export const fetchGetNetworkFee = () =>
  queryClient.fetchQuery(getGetNetworkFeeQueryOptions());

export const useGetNetworkFee = (options?: QueryOptions) => {
  const { getterContractAddress } = useSSVNetworkDetails();

  return useReadContract({
    abi: MainnetV4GetterABI,
    address: getterContractAddress,
    functionName: "getNetworkFee",

    query: options,
  });
};

// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------
