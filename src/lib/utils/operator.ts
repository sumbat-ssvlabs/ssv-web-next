import { globals } from "@/config";
import { ethFormatter } from "@/lib/utils/number";
import type { Operator } from "@/types/api";
import type { IOperator } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/IOperator";
import { formatUnits } from "viem";

type GetYearlyFeeOpts = {
  format?: boolean;
};

export function getYearlyFee(fee: bigint, opts: { format: true }): string;
export function getYearlyFee(fee: bigint, opts?: GetYearlyFeeOpts): bigint;
export function getYearlyFee(
  fee: bigint,
  opts?: GetYearlyFeeOpts,
): string | bigint {
  const yearlyFee = fee * BigInt(globals.BLOCKS_PER_YEAR);
  if (opts?.format)
    return ethFormatter.format(+formatUnits(yearlyFee, 18)) + " SSV";
  return yearlyFee;
}

export const getMevRelaysAmount = (mev?: string) =>
  mev ? mev.split(",").filter((item: string) => item).length : 0;

export const MEV_RELAYS = {
  AESTUS: "Aestus",
  AGNOSTIC: "Agnostic Gnosis",
  BLOXROUTE_MAX_PROFIT: "bloXroute Max Profit",
  BLOXROUTE_REGULATED: "bloXroute Regulated",
  EDEN: "Eden Network",
  FLASHBOTS: "Flashbots",
  MANIFOLD: "Manifold",
  ULTRA_SOUND: "Ultra Sound",
};

export const MEV_RELAYS_LOGOS = {
  [MEV_RELAYS.AESTUS]: "Aestus",
  [MEV_RELAYS.AGNOSTIC]: "agnostic",
  [MEV_RELAYS.BLOXROUTE_MAX_PROFIT]: "blox-route",
  [MEV_RELAYS.BLOXROUTE_REGULATED]: "blox-route",
  [MEV_RELAYS.EDEN]: "eden",
  [MEV_RELAYS.FLASHBOTS]: "Flashbots",
  [MEV_RELAYS.MANIFOLD]: "manifold",
  [MEV_RELAYS.ULTRA_SOUND]: "ultraSound",
};

export const sortOperators = (operators: Operator[]) => {
  return [...operators].sort((a, b) => a.id - b.id);
};

export const prepareOperatorsForShares = (operators: Operator[]): IOperator[] =>
  sortOperators(operators).map((operator) => ({
    id: operator.id,
    operatorKey: operator.public_key,
  }));

export const sumOperatorsFee = (operators: Operator[]) => {
  return operators.reduce((acc, operator) => acc + BigInt(operator.fee), 0n);
};

export const getOperatorIds = (operators: Operator[]) => {
  return operators.map((operator) => operator.id);
};
