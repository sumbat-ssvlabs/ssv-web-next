/* eslint-disable @typescript-eslint/no-explicit-any */
import { ms } from "@/lib/utils/number";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import type {
  dataTagSymbol,
  DefaultOptions,
  Updater,
  UseMutationOptions,
} from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { deserialize, serialize } from "wagmi";

const storageKey = "ssv:query-client-offline-cache";
const versionKey = "ssv:web-app-version";

const prevVersion = window.localStorage.getItem(versionKey);
if (prevVersion !== APP_VERSION) {
  window.localStorage.removeItem(storageKey);
  window.localStorage.setItem(versionKey, APP_VERSION);
}

export const queryConfig = {
  queries: {
    staleTime: ms(30, "seconds"),
    gcTime: ms(24, "hours"),
  },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export const persister = createSyncStoragePersister({
  key: storageKey,
  serialize,
  storage: window.localStorage,
  deserialize,
});

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<
  T extends (...args: any) => any = (...args: any) => any,
> = Omit<ReturnType<T>, "queryKey" | "queryFn">;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;

type ExtractDataTagSymbol<T> = T extends {
  [K in typeof dataTagSymbol]: infer U;
}
  ? U
  : never;

type CustomQueryKey = (string | undefined)[] & {
  [dataTagSymbol]: unknown;
};

export const setOptimisticData = <
  T extends CustomQueryKey,
  Data = ExtractDataTagSymbol<T>,
>(
  queryKey: T,
  updater: Updater<Data | undefined, Data | undefined>,
) => {
  queryClient.cancelQueries({ queryKey });
  // @ts-expect-error don't know how to fix this
  queryClient.setQueryData(queryKey, updater);
};
