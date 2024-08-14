import { isUndefined } from "lodash-es";

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

export const roundOperatorFee = (
  fee: bigint,
  precision = 10_000_000n,
): bigint => {
  return bigintRound(fee, precision);
};
