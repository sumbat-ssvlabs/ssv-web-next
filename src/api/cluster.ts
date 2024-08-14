import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import { getDefaultClusterData } from "@/lib/utils/cluster";
import type {
  GetClusterResponse,
  GetPaginatedClustersResponse,
  SolidityCluster,
} from "@/types/api";
import type { Address } from "abitype";

export const getCluster = (hash: string) =>
  api
    .get<GetClusterResponse>(endpoint("clusters", hash))
    .then((res) => res.cluster);

export const getClusterData = (hash: string): Promise<SolidityCluster> =>
  getCluster(hash)
    .then((cluster) => cluster ?? getDefaultClusterData())
    .catch(() => getDefaultClusterData());

export type GetPaginatedAccountClusters = {
  account: string | Address;
  page?: number;
  perPage?: number;
};

export const getPaginatedAccountClusters = ({
  account,
  page = 1,
  perPage = 10,
}: GetPaginatedAccountClusters) => {
  return api.get<GetPaginatedClustersResponse>(
    endpoint(
      "clusters",
      "owner",
      account,
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
