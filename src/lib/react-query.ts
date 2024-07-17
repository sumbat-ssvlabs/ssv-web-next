/* eslint-disable @typescript-eslint/no-explicit-any */
import { ms } from "@/lib/utils/number";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  DefaultOptions,
  QueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { deserialize, serialize } from "wagmi";

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
  serialize,
  storage: window.localStorage,
  deserialize,
});

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
