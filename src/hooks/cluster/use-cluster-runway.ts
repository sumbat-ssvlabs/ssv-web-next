import { useRunway } from "@/hooks/cluster/use-calculate-runway";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterBurnRate } from "@/hooks/cluster/use-cluster-burn-rate";

type Options = {
  deltaBalance: bigint;
};

export const useClusterRunway = (
  hash: string,
  opts: Options = { deltaBalance: 0n },
) => {
  const balance = useClusterBalance(hash);
  const burnRate = useClusterBurnRate(hash);

  const runway = useRunway({
    balance: balance.data ?? 0n,
    burnRate: burnRate.data ?? 0n,
    deltaBalance: opts.deltaBalance,
  });

  return runway;
};
