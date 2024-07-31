/* eslint-disable @typescript-eslint/no-explicit-any */
import { ms } from "@/lib/utils/number";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import type { DefaultOptions, UseMutationOptions } from "@tanstack/react-query";
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
    staleTime: ms(10, "seconds"),
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
