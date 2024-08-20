import {
  getDefaultRunway,
  useCalculateRunway,
} from "@/hooks/cluster/use-calculate-runway";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterBurnRate } from "@/hooks/cluster/use-cluster-burn-rate";

type Options = {
  deltaBalance: bigint;
};

export const useClusterRunway = (
  hash: string,
  opts: Options = { deltaBalance: 0n },
) => {
  const cluster = useCluster(hash);
  const { data: balance = 0n, isLoading: balanceIsLoading } =
    useClusterBalance(hash);
  const { data: burnRate = 0n, isLoading: burnRateIsLoading } =
    useClusterBurnRate(hash);

  const runway = useCalculateRunway(balance, burnRate, opts);

  if (!cluster.data?.validatorCount || balanceIsLoading || burnRateIsLoading)
    return getDefaultRunway({
      isLoading: balanceIsLoading || burnRateIsLoading,
    });

  return runway;
};
