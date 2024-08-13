import { getOperatorQueryOptions } from "@/hooks/use-operator";
import type { Operator } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useOptimisticOrProvidedOperator = (operator: Operator) => {
  const optimisticOperator = useQuery({
    ...getOperatorQueryOptions(operator.id),
    enabled: false,
  });
  if (optimisticOperator.isStale) return operator;
  return optimisticOperator.data ?? operator;
};
