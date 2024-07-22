import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@/lib/react-query";
import { getOwnerNonce } from "@/api/account";
import { Address } from "abitype";

export const ownerNonceQueryOptions = (account: Address) => {
  return queryOptions({
    queryKey: ["owner-nonce", account],
    queryFn: () => getOwnerNonce(account),
  });
};

type UseOwnerNonceOptions = {
  options?: QueryConfig<typeof ownerNonceQueryOptions>;
};

export const useOwnerNonce = (
  account: Address,
  { options }: UseOwnerNonceOptions = {},
) => {
  return useQuery({
    ...ownerNonceQueryOptions(account),
    ...options,
  });
};
