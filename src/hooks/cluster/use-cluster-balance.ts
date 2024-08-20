import { useCluster } from "@/hooks/cluster/use-cluster";
import { useGetBalance } from "@/lib/contract-interactions/read/use-get-balance";
import { useAccount } from "wagmi";

export const useClusterBalance = (hash: string) => {
  const account = useAccount();
  const cluster = useCluster(hash);

  return useGetBalance(
    {
      clusterOwner: account.address!,
      cluster: {
        active: Boolean(cluster.data?.active),
        balance: BigInt(cluster.data?.balance ?? 0),
        index: BigInt(cluster.data?.index ?? 0),
        networkFeeIndex: BigInt(cluster.data?.networkFeeIndex ?? 0),
        validatorCount: cluster.data?.validatorCount ?? 0,
      },
      operatorIds: cluster.data?.operators.map((id) => BigInt(id)) ?? [],
    },
    {
      enabled: Boolean(account.address && cluster.data),
    },
  );
};
