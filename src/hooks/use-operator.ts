import { getOperator } from "@/api/operator";
import { type QueryConfig } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export const getOperatorQueryOptions = (id: number | string) => {
  return queryOptions({
    queryKey: ["operator", id.toString()],
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
  const params = useParams<{ operatorId: string }>();
  const _id = id ?? params.operatorId ?? "";
  return useQuery({
    staleTime: ms(1, "minutes"),
    ...getOperatorQueryOptions(_id),
    ...options,
  });
};
