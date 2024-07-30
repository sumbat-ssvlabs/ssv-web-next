import { getOperator } from "@/api/operator";
import { type QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export const getOperatorQueryOptions = (id: number | string) => {
  return queryOptions({
    queryKey: ["operator", id],
    queryFn: () => getOperator(id),
    enabled: !!id,
  });
};

type UseOperatorOptions = {
  options?: QueryConfig<typeof getOperatorQueryOptions>;
};

export const useOperator = (
  id?: number | string,
  { options }: UseOperatorOptions = {},
) => {
  const params = useParams<{ id: string }>();
  const _id = id ?? params.id ?? "";
  return useQuery({
    ...getOperatorQueryOptions(_id),
    ...options,
  });
};
