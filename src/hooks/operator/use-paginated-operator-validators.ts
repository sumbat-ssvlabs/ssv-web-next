import { getPaginatedOperatorValidators } from "@/api/operator";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteOperatorValidators = (
  _operatorId: number,
  perPage = 10,
) => {
  const params = useOperatorPageParams();
  const operatorId = _operatorId || params.operatorId;

  const infiniteQuery = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["paginated-operator-validators", operatorId, perPage],
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedOperatorValidators({
        operatorId: operatorId!.toString(),
        page: pageParam,
        perPage,
      }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    enabled: Boolean(operatorId),
  });

  const validators =
    infiniteQuery.data?.pages.flatMap((page) => page.validators) || [];

  return {
    validators,
    infiniteQuery,
  };
};
