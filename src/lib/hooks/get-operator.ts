import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@/lib/react-query";
import { api } from "@/lib/api-client";
import { endpoint } from "@/lib/hooks/use-ssv-network-details";

export type Operator = {
  id: number;
  id_str: string;
  declared_fee: string;
  previous_fee: string;
  fee: string;
  public_key: string;
  owner_address: string;
  address_whitelist: string;
  verified_operator?: boolean;
  balance: number;
  whitelist_addresses?: string[];
  whitelisting_contract?: string;
  is_private?: boolean;
  location: string;
  setup_provider: string;
  eth1_node_client: string;
  eth2_node_client: string;
  mev_relays: string;
  description: string;
  website_url: string;
  twitter_url: string;
  linkedin_url: string;
  dkg_address: string;
  logo: string;
  type: string;
  name: string;
  performance: {
    "24h": number;
    "30d": number;
  };
  is_valid: boolean;
  is_deleted: boolean;
  is_active: number;
  status: string;
  validators_count: number;
  version: string;
  network: string;
  updated_at: number;
};

export const getOperator = (id: number): Promise<Operator> => {
  return api.get(endpoint("operators", id)).then((res) => res.data);
};

export const getOperatorQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["operator", id],
    queryFn: () => getOperator(id),
  });
};

type UseOperatorOptions = {
  // @ts-expect-error - This is a bug in the types
  options?: QueryConfig<typeof getOperatorQueryOptions>;
};

export const useOperator = (
  id: number,
  { options }: UseOperatorOptions = {},
) => {
  return useQuery({
    ...getOperatorQueryOptions(id),
    ...options,
  });
};
