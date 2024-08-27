import { isValidatorRegisteredQueryOptions } from "@/hooks/use-is-validator-registered";
import { useSSVAccount } from "@/hooks/use-ssv-account";
import { queryClient } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { add0x } from "@/lib/utils/strings";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { sortBy } from "lodash-es";
import type { KeySharesItem } from "ssv-keys";

export type KeysharesValidatorStatus =
  | "registered"
  | "incorrect-nonce"
  | "valid";

export type ValidatorShareWithStatus = {
  share: KeySharesItem;
  status: KeysharesValidatorStatus;
};

export const useKeysharesValidatorsList = (
  shares?: KeySharesItem[],
  options: Omit<UseQueryOptions, "queryKey" | "queryFn"> = { enabled: true },
) => {
  const ssvAccount = useSSVAccount({ staleTime: 0, gcTime: 0 });
  const sortedShares = sortBy(shares, (share) => share.data.ownerNonce);

  return useQuery({
    staleTime: ms(10, "seconds"),
    queryKey: ["validators-state", ssvAccount.data?.nonce, sortedShares],
    queryFn: async () => {
      const states = await Promise.all(
        sortedShares.map(async (share) => {
          return queryClient
            .fetchQuery({
              ...isValidatorRegisteredQueryOptions(
                add0x(share.data.publicKey!),
              ),
              staleTime: ms(10, "seconds"),
            })
            .then(() => [share, true])
            .catch(() => [share, false]) as Promise<[KeySharesItem, boolean]>;
        }),
      );

      let i = 0;

      const sharesWithStatuses = states.map(([share, isRegistered]) => {
        if (isRegistered) return { share, status: "registered" };

        const validNonce = share.data.ownerNonce === ssvAccount.data!.nonce + i;
        i++;
        return {
          share,
          status: validNonce ? "valid" : "incorrect-nonce",
        };
      }) as ValidatorShareWithStatus[];

      const tags = sharesWithStatuses.reduce(
        (acc, { share, status }) => {
          acc[status].push(share);
          return acc;
        },
        {
          registered: [],
          "incorrect-nonce": [],
          valid: [],
          all: sortedShares,
        } as Record<KeysharesValidatorStatus | "all", KeySharesItem[]>,
      );

      return {
        tags,
        sharesWithStatuses,
      };
    },
    enabled: Boolean(ssvAccount.isSuccess && shares?.length && options.enabled),
  });
};
