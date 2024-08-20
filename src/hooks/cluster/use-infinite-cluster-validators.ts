import { getPaginatedClusterValidators } from "@/api/cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteClusterValidators = (
  clusterHash?: string,
  perPage = 10,
) => {
  const params = useClusterPageParams();
  const hash = clusterHash || params.clusterHash;

  const infiniteQuery = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["paginated-cluster-validators", hash, perPage],
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedClusterValidators({
        hash: hash!,
        page: pageParam,
        perPage,
      }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    enabled: Boolean(hash),
  });

  const validators =
    infiniteQuery.data?.pages.flatMap((page) => page.validators) || [];
  return {
    validators,
    infiniteQuery,
  };
};
