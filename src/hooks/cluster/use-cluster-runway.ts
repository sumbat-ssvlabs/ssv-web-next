import { useRunway } from "@/hooks/cluster/use-calculate-runway";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterBurnRate } from "@/hooks/cluster/use-cluster-burn-rate";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";

type Options = {
  deltaBalance?: bigint;
  deltaValidators?: bigint;
};

export const useClusterRunway = (
  hash?: string,
  opts: Options = { deltaBalance: 0n, deltaValidators: 0n },
) => {
  const params = useClusterPageParams();
  const clusterHash = hash ?? params.clusterHash;
  const { data: cluster } = useCluster(clusterHash);
  const { data: balance = 0n } = useClusterBalance(clusterHash!);
  const { data: burnRate = 0n } = useClusterBurnRate(clusterHash!);

  const burnRatePerValidator = burnRate / BigInt(cluster?.validatorCount || 1);

  const runway = useRunway({
    balance: balance,
    burnRate: burnRatePerValidator,
    validators: BigInt(cluster?.validatorCount ?? 0),
    deltaValidators: opts.deltaValidators,
    deltaBalance: opts.deltaBalance,
  });

  return runway;
};
