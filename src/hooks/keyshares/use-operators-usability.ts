import { useOperators } from "@/hooks/operator/use-operators";
import { useGetValidatorsPerOperatorLimit } from "@/lib/contract-interactions/read/use-get-validators-per-operator-limit";
import { canAccountUseOperator } from "@/lib/utils/operator";
import type { Operator } from "@/types/api";
import type { OperatorID } from "@/types/types";
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

export const useOperatorsUsability = ({ account, operatorIds }: Props) => {
  const { data: maxValidators = 0 } = useGetValidatorsPerOperatorLimit();
  const query = useOperators(operatorIds);

  return {
    ...query,
    data: query.data?.reduce(
      (acc, operator) => {
        const hasExceededValidatorsLimit =
          operator?.validators_count >= maxValidators;
        const canUse = canAccountUseOperator(account, operator);

        acc.operators.push({
          operator,
          isUsable: canUse && !hasExceededValidatorsLimit,
          status: hasExceededValidatorsLimit
            ? "exceeded_validators_limit"
            : !canUse
              ? "is_permissioned"
              : "usable",
        });

        acc.hasPermissionedOperators ||= !canUse;
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
    ),
  };
};
