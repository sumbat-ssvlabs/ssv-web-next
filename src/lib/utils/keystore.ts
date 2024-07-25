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
  liquidationCollateralPeriod: bigint;
  minimumLiquidationCollateral: bigint;
  operatorsFee: bigint;
};

export const computeLiquidationCollateralCost = (
  args: LiquidationCollateralCostArgs,
) => {
  const cost =
    args.operatorsFee + args.networkFee * args.liquidationCollateralPeriod;
  return bigintMax(cost, args.minimumLiquidationCollateral);
};

type ComputeFundingCostArgs = Prettify<
  {
    depositAmount: bigint;
    fundingDays: number;
  } & LiquidationCollateralCostArgs
>;

export const computeFundingCost = (args: ComputeFundingCostArgs) => {
  if (!args.fundingDays) return args.depositAmount;

  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateralCost = computeLiquidationCollateralCost(args);
  return (
    args.depositAmount + networkCost + operatorsCost + liquidationCollateralCost
  );
};
