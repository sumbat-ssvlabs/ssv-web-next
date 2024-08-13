import { queryOptions, useQuery } from "@tanstack/react-query";

import type { QueryConfig } from "@/lib/react-query";
import { getAccount } from "@/api/account";
import type { Address } from "abitype";
import { useAccount } from "wagmi";
import { ms } from "@/lib/utils/number";

export const getSSVAccountQueryOptions = (account?: Address) => {
  return queryOptions({
    staleTime: ms(1, "hours"),
    queryKey: ["ssv-account", account],
    queryFn: () => getAccount(account!),
    enabled: !!account,
  });
};

type UseSsvAccountOptions = {
  options?: QueryConfig<typeof getSSVAccountQueryOptions>;
};

export const useSSVAccount = ({ options }: UseSsvAccountOptions = {}) => {
  const { address } = useAccount();
  return useQuery({
    ...getSSVAccountQueryOptions(address),
    ...options,
  });
};
