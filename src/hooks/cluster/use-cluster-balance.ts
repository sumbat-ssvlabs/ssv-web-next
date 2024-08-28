import { useCluster } from "@/hooks/cluster/use-cluster";
import { useGetBalance } from "@/lib/contract-interactions/read/use-get-balance";
import { useAccount } from "wagmi";
import { formatClusterData } from "@/lib/utils/cluster";
import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";

export const useClusterBalance = (hash: string) => {
  const account = useAccount();
  const cluster = useCluster(hash);

  const operatorIds = useMemo(
    () => cluster.data?.operators.map((id) => BigInt(id)) ?? [],
    [cluster.data],
  );

  return useGetBalance(
    {
      clusterOwner: account.address!,
      cluster: formatClusterData(cluster.data),
      operatorIds,
    },
    {
      watch: true,
      placeholderData: keepPreviousData,
      enabled: Boolean(account.address && cluster.data),
    },
  );
};
