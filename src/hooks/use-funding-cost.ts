import { computeFundingCost } from "@/lib/utils/keystore";
import { useQuery } from "@tanstack/react-query";
import { serialize } from "wagmi";
import { useSsvNetworkFee } from "./use-ssv-network-fee";

type Args = {
  operatorsFee: bigint;
  validators: number;
  fundingDays: number;
};

export const useFundingCost = ({
  fundingDays,
  validators,
  operatorsFee,
}: Args) => {
  const {
    isSuccess,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee,
  } = useSsvNetworkFee();

  return useQuery({
    queryKey: [
      "funding-cost",
      operatorsFee,
      validators,
      fundingDays,
      liquidationThresholdPeriod.data,
      minimumLiquidationCollateral.data,
      ssvNetworkFee.data,
    ].map((v) => serialize(v)),
    queryFn: async () => {
      return computeFundingCost({
        operatorsFee,
        fundingDays,
        networkFee: ssvNetworkFee.data!,
        liquidationCollateralPeriod: liquidationThresholdPeriod.data!,
        minimumLiquidationCollateral: minimumLiquidationCollateral.data!,
      });
    },
    enabled: isSuccess,
  });
};
