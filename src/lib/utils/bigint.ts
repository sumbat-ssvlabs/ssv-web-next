export const bigintMax = (...args: bigint[]): bigint => {
  return args.reduce((max, cur) => (cur > max ? cur : max), BigInt(0));
};
