import { useGetBurnRate } from "@/lib/contract-interactions/read/use-get-burn-rate";
import { useAccount } from "@/hooks/account/use-account";
import { useCluster } from "./use-cluster";
import { formatClusterData } from "@/lib/utils/cluster";

export const useClusterBurnRate = (hash: string) => {
  const account = useAccount();
  const cluster = useCluster(hash);

  return useGetBurnRate(
    {
      clusterOwner: account.address!,
      cluster: formatClusterData(cluster.data),
      operatorIds: cluster.data?.operators.map((id) => BigInt(id)) ?? [],
    },
    {
      enabled: Boolean(account.address && cluster.data),
    },
  );
};
