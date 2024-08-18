import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import type { Operator } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useOptimisticOrProvidedOperator = (operator: Operator) => {
  const optimisticOperator = useQuery({
    ...getOperatorQueryOptions(operator.id),
    enabled: false,
  });
  console.log(optimisticOperator.data?.id_str, optimisticOperator);
  if (optimisticOperator.isStale) return operator;
  return optimisticOperator.data ?? operator;
};
