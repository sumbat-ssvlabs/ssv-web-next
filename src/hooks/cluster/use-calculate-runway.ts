import { globals } from "@/config";
import { useSsvNetworkFee } from "@/hooks/use-ssv-network-fee";
import { bigintMax } from "@/lib/utils/bigint";
import { numberFormatter } from "@/lib/utils/number";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { serialize } from "@wagmi/core";

type Runway = {
  balance: bigint;
  runway: bigint;
  runwayDisplay: string;
  isAtRisk: boolean;
  isLoading: boolean;
  burnRate: bigint;
};

export const getDefaultRunway = (runway: Partial<Runway> = {}) => ({
  balance: 0n,
  runway: 0n,
  runwayDisplay: "- -",
  isAtRisk: false,
  isLoading: false,
  burnRate: 0n,
  ...runway,
});

type Params = {
  balance: bigint;
  burnRate: bigint;
  deltaBalance?: bigint;
};

export const useRunway = ({ balance, burnRate, deltaBalance = 0n }: Params) => {
  const {
    liquidationThresholdPeriod: { data: liquidationThresholdBlocks = 0n },
    minimumLiquidationCollateral: { data: minimumLiquidationCollateral = 0n },
    isLoading,
    isSuccess,
  } = useSsvNetworkFee();

  const query = useQuery({
    queryKey: [
      "calculate-runway",
      balance,
      burnRate,
      deltaBalance,
      liquidationThresholdBlocks,
      minimumLiquidationCollateral,
    ].map((v) => serialize(v)),
    queryFn: async () => {
      const collateral = bigintMax(
        burnRate * liquidationThresholdBlocks,
        minimumLiquidationCollateral,
      );

      const burnRatePerDay = burnRate * globals.BLOCKS_PER_DAY;

      const runway = bigintMax(
        0n,
        (balance + deltaBalance - collateral) / burnRatePerDay,
      );

      return {
        runway,
        runwayDisplay: `${numberFormatter.format(runway)} days`,
        isAtRisk: runway < 30n,
      };
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(balance && burnRate && isSuccess),
  });
  return {
    ...query,
    isLoading: query.isLoading || isLoading,
  };
};
