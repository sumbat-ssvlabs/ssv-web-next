import { getPaginatedAccountOperators } from "@/api/operator";
import { createDefaultPagination } from "@/lib/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

export const usePaginatedAccountOperators = (perPage = 10) => {
  const { address } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const query = useQuery({
    queryKey: ["paginated-account-operators", address, page, perPage],
    queryFn: () =>
      getPaginatedAccountOperators({
        address: address!,
        page: page,
        perPage,
      }),
    enabled: Boolean(address),
  });

  const operators = query.data?.operators || [];
  const pagination = query.data?.pagination || createDefaultPagination();

  const hasNext = pagination.page < pagination.pages;
  const hasPrev = pagination.page > 1;

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
