export const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

export const ethFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 2,
});
