import { queryOptions, useQuery } from "@tanstack/react-query";

import type { QueryConfig } from "@/lib/react-query";
import { getCluster } from "@/api/cluster";

export const getClusterQueryOptions = (hash?: string) => {
  return queryOptions({
    queryKey: ["cluster", hash],
    queryFn: () => getCluster(hash!),
    enabled: Boolean(hash),
  });
};

type UseClusterOptions = QueryConfig<typeof getClusterQueryOptions>;

export const useCluster = (hash: string, options?: UseClusterOptions) => {
  const queryOptions = getClusterQueryOptions(hash);
  return useQuery({
    ...queryOptions,
    ...options,
    enabled: queryOptions.enabled && options?.enabled,
  });
};
