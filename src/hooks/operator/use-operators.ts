import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import type { Operator } from "@/types/api";
import type { OperatorID } from "@/types/types";
import { useQueries } from "@tanstack/react-query";

export const useOperators = (operatorIds: OperatorID[]) => {
  console.log("operatorIds:", operatorIds);
  return useQueries({
    queries: operatorIds.map((id) => getOperatorQueryOptions(id)),
    combine: (queries) => {
      const operators = queries.map((query) => query.data) as Operator[];
      const isError = queries.some((query) => query.isError);
      const isSuccess = queries.every((query) => query.isSuccess);
      return {
        data: isSuccess && !isError ? operators : undefined,
        isLoading: queries.some((query) => query.isLoading),
        isPending: queries.some((query) => query.isPending),
        isError: isError,
        isSuccess: isSuccess,
      };
    },
  });
};
