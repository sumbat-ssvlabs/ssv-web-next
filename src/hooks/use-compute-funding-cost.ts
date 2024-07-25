import { computeFundingCost } from "@/lib/utils/keystore";
import { useMutation } from "@tanstack/react-query";
import { useSsvNetworkFee } from "./use-ssv-network-fee";

type Args = {
  operatorsFee: bigint;
  validators: number;
  fundingDays: number;
};

export const useComputeFundingCost = () => {
  const {
    isSuccess,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee,
  } = useSsvNetworkFee();

  return useMutation({
    mutationFn: async ({ fundingDays, validators, operatorsFee }: Args) => {
      if (!isSuccess) {
        throw new Error("Something went wrong, please try again later.");
      }
      return computeFundingCost({
        operatorsFee,
        fundingDays,
        networkFee: ssvNetworkFee.data!,
        liquidationCollateralPeriod: liquidationThresholdPeriod.data!,
        minimumLiquidationCollateral: minimumLiquidationCollateral.data!,
        validators,
      });
    },
  });
};
