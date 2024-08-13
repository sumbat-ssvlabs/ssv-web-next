import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import { getDefaultClusterData } from "@/lib/utils/cluster";
import type {
  GetClusterResponse,
  GetPaginatedClustersResponse,
  SolidityCluster,
} from "@/types/api";

export const getCluster = (hash: string) =>
  api.get<GetClusterResponse>(endpoint("cluster", hash));

export const getClusterData = (hash: string): Promise<SolidityCluster> =>
  getCluster(hash)
    .then((res) => res.cluster ?? getDefaultClusterData())
    .catch(() => getDefaultClusterData());

export type GetPaginatedAccountClusters = {
  address: string;
  page?: number;
  perPage?: number;
};

export const getPaginatedAccountClusters = ({
  address,
  page = 1,
  perPage = 10,
}: GetPaginatedAccountClusters) => {
  return api.get<GetPaginatedClustersResponse>(
    endpoint(
      "clusters",
      "owner",
      address,
      `?${new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        withFee: "true",
        ordering: "id:asc",
        operatorDetails: "operatorDetails",
      }).toString()}`,
    ),
  );
};
