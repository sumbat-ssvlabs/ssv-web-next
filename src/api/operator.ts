import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import type { Country, Operator, OperatorsSearchResponse } from "@/types/api";
import { isUndefined, omitBy } from "lodash-es";

export const getOperator = (id: number | string) => {
  return api.get<Operator>(endpoint("operators", id)).then((res) => res.data);
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

export const getOperatorLocations = () => {
  return api
    .get<Country[]>(endpoint("operators", "locations"))
    .then((res) => res.data);
};
export const getOperatorNodes = (layer: number) => {
  return api
    .get<string[]>(endpoint("operators", "nodes", layer))
    .then((res) => res.data);
};
