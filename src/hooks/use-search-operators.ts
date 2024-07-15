import { searchOperators, SearchOperatorsParams } from "@/api/operator";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useSearchOperators = ({
  ordering = "id:asc",
  search,
}: Pick<SearchOperatorsParams, "ordering" | "search"> = {}) => {
  return useInfiniteQuery({
    gcTime: 1000 * 60,
    initialPageParam: 1,
    queryKey: ["search-operators", ordering, search],
    queryFn: ({ pageParam }) =>
      searchOperators({
        search,
        ordering,
        page: pageParam,
        perPage: 20,
      }).then((res) => res.data),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
  });
};
