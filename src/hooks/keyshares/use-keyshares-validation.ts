import { useSelectedOperators } from "@/guard/register-validator-guard";
import { queryFetchOperators } from "@/hooks/operator/use-operators";
import type { UseQueryOptions } from "@/lib/react-query";
import { KeysharesValidationError } from "@/lib/utils/keyshares";
import {
  ensureValidatorsUniqueness,
  KeysharesValidationErrors,
  validateConsistentOperatorIds,
  validateConsistentOperatorPublicKeys,
  validateKeysharesSchema,
} from "@/lib/utils/keyshares";
import { sortNumbers } from "@/lib/utils/number";
import { useQuery } from "@tanstack/react-query";
import { isEqual } from "lodash-es";
import type { KeySharesItem } from "ssv-keys";

export const useKeysharesValidation = (
  file: File | null,
  options: UseQueryOptions<
    KeySharesItem[],
    Error | KeysharesValidationError
  > = {
    enabled: true,
  },
) => {
  const operatorIds = useSelectedOperators();
  const isEnabled = Boolean(file && operatorIds.length && options.enabled);
  return useQuery({
    queryKey: ["keyshares-validation", file, operatorIds],
    queryFn: async () => {
      const shares = await validateKeysharesSchema(file!);
      const ids = validateConsistentOperatorIds(shares);

      if (!isEqual(sortNumbers(ids), sortNumbers(operatorIds))) {
        throw new KeysharesValidationError(
          KeysharesValidationErrors.DifferentCluster,
        );
      }

      ensureValidatorsUniqueness(shares);

      const operators = await queryFetchOperators(operatorIds).catch(
        () => new Error("Failed to fetch operators"),
      );

      if (operators instanceof Error) {
        throw operators;
      }

      validateConsistentOperatorPublicKeys(shares, operators);
      return shares;
    },
    retry: false,
    ...options,
    enabled: isEnabled,
  });
};
