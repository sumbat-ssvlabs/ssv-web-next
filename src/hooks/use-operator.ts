import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { getOperator } from "@/api/operator";

export const getOperatorQueryOptions = (id: number | string) => {
  return queryOptions({
    queryKey: ["operator", id],
    queryFn: () => getOperator(id),
  });
};

type UseOperatorOptions = {
  options?: QueryConfig<typeof getOperatorQueryOptions>;
};

export const useOperator = (
  id: number | string,
  { options }: UseOperatorOptions = {},
) => {
  return useQuery({
    ...getOperatorQueryOptions(id),
    ...options,
  });
};
