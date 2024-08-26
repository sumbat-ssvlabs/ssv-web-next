import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { combineQueryStatus } from "@/lib/react-query";
import type { Operator } from "@/types/api";
import type { OperatorID } from "@/types/types";
import { useQueries } from "@tanstack/react-query";

export const useOperators = (operatorIds: OperatorID[]) => {
  return useQueries({
    queries: operatorIds.map((id) => getOperatorQueryOptions(id)),
    combine: (queries) => {
      const operators = queries.map((query) => query.data) as Operator[];
      const status = combineQueryStatus(...queries);
      return {
        data: status.isSuccess && !status.isError ? operators : undefined,
        ...status,
      };
    },
  });
};
