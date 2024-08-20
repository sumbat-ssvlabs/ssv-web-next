import { useCluster } from "@/hooks/cluster/use-cluster";
import { useGetBalance } from "@/lib/contract-interactions/read/use-get-balance";
import { useAccount } from "wagmi";
import { formatClusterData } from "@/lib/utils/cluster";

export const useClusterBalance = (hash: string) => {
  const account = useAccount();
  const cluster = useCluster(hash);

  return useGetBalance(
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
