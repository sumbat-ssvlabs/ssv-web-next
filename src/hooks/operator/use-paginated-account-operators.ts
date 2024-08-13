import { getPaginatedAccountOperators } from "@/api/operator";
import { useCreatedOptimisticOperators } from "@/hooks/operator/use-created-optimistic-operators";
import { createDefaultPagination } from "@/lib/utils/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { unionBy } from "lodash-es";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

export const getPaginatedAccountOperatorsQueryOptions = (
  address: Address | undefined,
  page: number = 1,
  perPage: number = 10,
) =>
  queryOptions({
    queryKey: ["paginated-account-operators", address, page, perPage],
    queryFn: () =>
      getPaginatedAccountOperators({
        address: address!,
        page: page,
        perPage,
      }),
    enabled: Boolean(address),
  });

export const usePaginatedAccountOperators = (perPage = 10) => {
  const { address } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const { data: optimisticOperators = [] } = useCreatedOptimisticOperators();

  const query = useQuery(
    getPaginatedAccountOperatorsQueryOptions(address, page, perPage),
  );

  if (query.data?.pagination && page > query.data.pagination.pages) {
    setSearchParams((prev) => ({
      ...prev,
      page: String(query.data.pagination.pages),
    }));
  }

  const pagination = query.data?.pagination || createDefaultPagination();
  const hasNext = page < pagination.pages;
  const hasPrev = page > 1;
  const isLastPage = page === pagination.pages;

  const operators =
    (isLastPage
      ? unionBy(query.data?.operators, optimisticOperators, "id") || []
      : query.data?.operators) || [];

  const next = () => {
    hasNext &&
      setSearchParams((prev) => ({
        ...prev,
        page: String(page + 1),
      }));
  };

  const prev = () => {
    hasPrev &&
      setSearchParams((prev) => ({
        ...prev,
        page: String(page - 1),
      }));
  };

  return {
    query,
    operators,
    pagination,
    hasNext,
    hasPrev,
    next,
    prev,
    page,
  };
};
