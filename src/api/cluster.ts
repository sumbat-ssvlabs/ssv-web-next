import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import { getDefaultClusterData } from "@/lib/utils/cluster";
import type { Cluster, GetClusterResponse } from "@/types/api";

export const getCluster = (hash: string) =>
  api.get<GetClusterResponse>(endpoint("cluster", hash));

export const getClusterData = (hash: string): Promise<Cluster["clusterData"]> =>
  getCluster(hash)
    .then((res) => res.data.cluster ?? getDefaultClusterData())
    .catch(() => getDefaultClusterData());
