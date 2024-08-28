import { formatUnits } from "viem";

export const numberFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 2,
});

export const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

export const ethFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 4,
});

export const formatSSV = (num: bigint, decimals = 18) =>
  ethFormatter.format(+formatUnits(num, decimals));

const units = {
  seconds: 1000,
  minutes: 60000,
  hours: 3600000,
  days: 86400000,
  weeks: 604800000,
} as const;

export const ms = (value: number, unit: keyof typeof units): number => {
  return value * units[unit];
};

export const sortNumbers = <T extends bigint | number>(numbers: T[]): T[] => {
  return [...numbers].sort((a, b) => Number(a) - Number(b));
};
