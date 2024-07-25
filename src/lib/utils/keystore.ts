import { globals } from "@/config";
import { bigintMax } from "./bigint";
import type { Prettify } from "@/types/typescript";

export const computeDailyAmount = (value: bigint, days: number) => {
  const scale = 10 ** 6;
  const scaledDays = BigInt(days * scale);
  return (value * scaledDays * BigInt(globals.BLOCKS_PER_DAY)) / BigInt(scale);
};

type LiquidationCollateralCostArgs = {
  networkFee: bigint;
  operatorsFee: bigint;
  liquidationCollateralPeriod: bigint;
  minimumLiquidationCollateral: bigint;
  validators?: number;
};

export const computeLiquidationCollateralCost = ({
  networkFee,
  operatorsFee,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  validators = 1,
}: LiquidationCollateralCostArgs) => {
  const cost =
    operatorsFee +
    networkFee * liquidationCollateralPeriod * BigInt(validators);
  return bigintMax(cost, minimumLiquidationCollateral) / BigInt(validators);
};

type ComputeFundingCostArgs = Prettify<
  {
    fundingDays: number;
  } & LiquidationCollateralCostArgs
>;

export const computeFundingCost = (args: ComputeFundingCostArgs) => {
  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateralCost = computeLiquidationCollateralCost(args);
  return (
    (networkCost + operatorsCost + liquidationCollateralCost) *
    BigInt(args.validators ?? 1)
  );
};
