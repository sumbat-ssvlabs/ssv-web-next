import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import type { Country, Operator, OperatorsSearchResponse } from "@/types/api";
import { isUndefined, omitBy } from "lodash-es";

export const getOperator = (id: number | string) => {
  return api.get<Operator>(endpoint("operators", id));
};

type OrderBy = "id" | "validators_count" | "performance.30d" | "fee" | "mev";
type Sort = "asc" | "desc";

export type SearchOperatorsParams = {
  search?: string;
  ordering?: `${OrderBy}:${Sort}`;
  page?: number;
  perPage?: number;
};

export const searchOperators = (params: SearchOperatorsParams) => {
  const filtered = omitBy(params, isUndefined);
  const searchParams = new URLSearchParams(filtered as Record<string, string>);
  return api.get<OperatorsSearchResponse>(
    endpoint("operators", `?${searchParams}`),
  );
};

type GetAccountOperatorsParams = {
  address: string;
  page?: number;
  perPage?: number;
};
export const getPaginatedAccountOperators = ({
  address,
  page = 1,
  perPage = 10,
}: GetAccountOperatorsParams) => {
  return api.get<OperatorsSearchResponse>(
    endpoint(
      "operators",
      "owned_by",
      address,
      `?${new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        withFee: "true",
        ordering: "id:asc",
      }).toString()}`,
    ),
  );
};

export const getOperatorLocations = () => {
  return api.get<Country[]>(endpoint("operators", "locations"));
};

export const getOperatorNodes = (layer: number) => {
  return api.get<string[]>(endpoint("operators", "nodes", layer));
};
export interface OperatorMetadata {
  operatorName: string;
  description: string;
  location: string;
  setupProvider: string;
  eth1NodeClient: string;
  eth2NodeClient: string;
  mevRelays: string;
  websiteUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  dkgAddress: string;
  logo: string;
  signature: string;
}

export const setOperatorMetadata = (
  operatorId: string,
  metadata: OperatorMetadata,
) => {
  return api.put(endpoint("operators", operatorId, "metadata"), metadata);
};
