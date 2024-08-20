import { useCluster } from "@/hooks/cluster/use-cluster";
import { formatClusterData } from "@/lib/utils/cluster";

export const useClusterData = (hash: string) => {
  const cluster = useCluster(hash);
  return formatClusterData(cluster.data);
};
