import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { queryClient, type QueryConfig } from "@/lib/react-query";
import {
  KeysharesValidationError,
  KeysharesValidationErrors,
  validateConsistentOperatorIds,
  validateConsistentOperatorPublicKeys,
} from "@/lib/utils/keyshares";
import { sortNumbers } from "@/lib/utils/number";
import { useQuery } from "@tanstack/react-query";
import type { KeySharesItem } from "ssv-keys";

type Params = {
  shares?: KeySharesItem[];
  operatorIds?: number[];
};

export const validateKeysharesOperators = async ({
  shares,
  operatorIds: _operatorIds,
}: Params & Required<Pick<Params, "shares">>) => {
  const operatorIds = sortNumbers(
    _operatorIds ?? shares[0].payload.operatorIds,
  );

  const hasConsistentOperatorIds = validateConsistentOperatorIds(
    shares,
    operatorIds,
  );

  if (!hasConsistentOperatorIds) {
    throw new KeysharesValidationError(
      KeysharesValidationErrors.InconsistentOperators,
    );
  }

  const operators = await Promise.all(
    operatorIds.map((id) => {
      return queryClient.fetchQuery(getOperatorQueryOptions(id));
    }),
  );

  const hasConsistentOperatorPublicKeys = validateConsistentOperatorPublicKeys(
    shares,
    operators,
  );

  if (!hasConsistentOperatorPublicKeys) {
    throw new KeysharesValidationError(
      KeysharesValidationErrors.InconsistentOperatorPublicKeys,
    );
  }
  return true;
};

export const useKeysharesOperatorsValidation = (
  params: Params,
  options: QueryConfig = {},
) => {
  return useQuery({
    queryKey: ["keyshares-operators-validation", params],
    queryFn: () => validateKeysharesOperators(params as Required<Params>),
    retry: false,
    ...options,
    enabled: Boolean(params.shares),
  });
};
