import { globals } from "@/config";
import { useSsvNetworkFee } from "@/hooks/use-ssv-network-fee";
import { bigintMax } from "@/lib/utils/bigint";
import { numberFormatter } from "@/lib/utils/number";

type Options = {
  deltaBalance: bigint;
};

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

export const useCalculateRunway = (
  balance: bigint,
  burnRate: bigint,
  opts: Options = { deltaBalance: 0n },
) => {
  const {
    liquidationThresholdPeriod: { data: liquidationThresholdBlocks = 0n },
    minimumLiquidationCollateral: { data: minimumLiquidationCollateral = 0n },
    isLoading,
  } = useSsvNetworkFee();

  const collateral = bigintMax(
    burnRate * liquidationThresholdBlocks,
    minimumLiquidationCollateral,
  );

  const runway = bigintMax(
    0n,
    (balance + opts.deltaBalance - collateral) /
      (burnRate * globals.BLOCKS_PER_DAY || 1n),
  );

  const isAtRisk = !isLoading && runway < 30n;

  const runwayDisplay = `${numberFormatter.format(runway)} days`;

  return { balance, runway, runwayDisplay, isAtRisk, burnRate, isLoading };
};
