import { isUndefined } from "lodash-es";
import { parseUnits } from "viem";

export const bigintMax = (...args: (bigint | undefined)[]): bigint => {
  return args
    .filter((x) => !isUndefined(x))
    .reduce((max, cur) => (cur > max ? cur : max), BigInt(0));
};

export const bigintMin = (...args: (bigint | undefined)[]): bigint => {
  return args
    .filter((x) => !isUndefined(x))
    .reduce((min, cur) => (cur < min ? cur : min));
};
export const bigintRound = (value: bigint, precision: bigint): bigint => {
  const remainder = value % precision;
  return remainder >= precision / 2n
    ? value + (precision - remainder) // Round up
    : value - remainder; // Round down
};

export const bigintAbs = (n: bigint) => (n < 0n ? -n : n);

/**
 * Checks if the difference between two bigints exceeds a specified tolerance.
 *
 * @param {bigint} a - The first bigint value.
 * @param {bigint} b - The second bigint value.
 * @param {bigint} [tolerance] - default is `parseUnits("0.0001", 18)`.
 */
export const isBigIntChanged = (
  a: bigint,
  b: bigint,
  tolerance = parseUnits("0.0001", 18),
): boolean => {
  return bigintAbs(a - b) > tolerance;
};

export const roundOperatorFee = (
  fee: bigint,
  precision = 10_000_000n,
): bigint => {
  return bigintRound(fee, precision);
};
