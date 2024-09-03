import { useOperators } from "@/hooks/operator/use-operators";
import { useGetValidatorsPerOperatorLimit } from "@/lib/contract-interactions/read/use-get-validators-per-operator-limit";
import type { UseQueryOptions } from "@/lib/react-query";
import { combineQueryStatus } from "@/lib/react-query";
import { canAccountUseOperator } from "@/lib/utils/operator";
import type { Operator } from "@/types/api";
import type { OperatorID } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";

type Props = {
  account: Address;
  operatorIds: OperatorID[];
  additionalValidators?: number;
};

type Result = {
  operators: {
    operator: Operator;
    isUsable: boolean;
    status: string;
  }[];
  hasPermissionedOperators: boolean;
  hasExceededValidatorsLimit: boolean;
  maxAddableValidators: number;
};

export const useOperatorsUsability = (
  { account, operatorIds }: Props,
  options: UseQueryOptions<Record<number, boolean>> = { enabled: true },
) => {
  const { data: maxValidators = 0 } = useGetValidatorsPerOperatorLimit();
  const operators = useOperators(operatorIds);

  const canUse = useQuery({
    queryKey: ["canAccountUseOperator", operators, account, maxValidators],
    queryFn: async () => {
      const result = await Promise.all(
        operators.data!.map(
          async (operator) =>
            [operator, await canAccountUseOperator(account, operator)] as const,
        ),
      );

      return result.reduce(
        (acc, [operator, canUse]) => {
          acc[operator.id] = canUse;
          return acc;
        },
        {} as Record<number, boolean>,
      );
    },
    ...options,
    enabled: Boolean(operators.data && options.enabled),
  });

  const queryStatus = combineQueryStatus(canUse, operators);
  return {
    ...queryStatus,
    data: queryStatus.isSuccess
      ? operators.data?.reduce(
          (acc, operator) => {
            const hasExceededValidatorsLimit =
              operator?.validators_count >= maxValidators;
            const isUsable = canUse.data?.[operator.id] ?? false;

            acc.operators.push({
              operator,
              isUsable: isUsable && !hasExceededValidatorsLimit,
              status: hasExceededValidatorsLimit
                ? "exceeded_validators_limit"
                : !isUsable
                  ? "is_permissioned"
                  : "usable",
            });

            acc.hasPermissionedOperators ||= !isUsable;
            acc.hasExceededValidatorsLimit ||= hasExceededValidatorsLimit;
            acc.maxAddableValidators = Math.min(
              acc.maxAddableValidators,
              maxValidators - operator.validators_count,
            );
            return acc;
          },
          {
            operators: [],
            hasPermissionedOperators: false,
            hasExceededValidatorsLimit: false,
            maxAddableValidators: Infinity,
          } as Result,
        )
      : undefined,
  };
};
