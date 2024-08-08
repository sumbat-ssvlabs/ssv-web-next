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
