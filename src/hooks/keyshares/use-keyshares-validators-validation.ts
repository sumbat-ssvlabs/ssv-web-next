import { type QueryConfig } from "@/lib/react-query";
import { noDuplicatedValidatorKeys } from "@/lib/utils/keyshares";

import { useQuery } from "@tanstack/react-query";
import type { KeyShares } from "ssv-keys";

export const useKeysharesValidatorsValidation = (
  keyshares?: KeyShares,
  options: QueryConfig = {},
) => {
  return useQuery({
    queryKey: ["keyshares-validators-validation", keyshares],
    queryFn: () => noDuplicatedValidatorKeys(keyshares!.list()),
    retry: false,
    ...options,
    enabled: Boolean(keyshares),
  });
};
