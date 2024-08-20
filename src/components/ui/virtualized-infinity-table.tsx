import type { FC, ReactNode } from "react";
import type { TableProps } from "@/components/ui/grid-table";
import { Table, TableCell, TableHeader } from "@/components/ui/grid-table";

import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { VList } from "virtua";
import { Spinner } from "@/components/ui/spinner";
import { useInterval } from "react-use";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";

export type VirtualizedInfinityTableProps<
  T,
  TQuery extends UseInfiniteQueryResult<
    unknown,
    unknown
  > = UseInfiniteQueryResult<unknown, unknown>,
> = {
  items: T[];
  headers: ReactNode[];
  renderRow: (args: { item: T; index: number }) => ReactNode;
  query: TQuery;
} & TableProps;

const Trigger: FC<{
  onRequestNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}> = ({ onRequestNextPage, isFetchingNextPage, hasNextPage }) => {
  useInterval(
    onRequestNextPage,
    !isFetchingNextPage && hasNextPage ? 50 : null,
  );
  return null;
};

export const VirtualizedInfinityTable = <T,>({
  items,
  headers,
  renderRow,
  className,
  query,
  ...props
}: VirtualizedInfinityTableProps<T>) => {
  console.log("items.length:", items.length);
  return (
    <Table className={cn("h-full", className)} {...props}>
      <TableHeader className="sticky top-0">
        {headers.map((header, index) => (
          <TableCell key={index}>{header}</TableCell>
        ))}
      </TableHeader>
      {Boolean(items.length) && (
        <VList
          overscan={10}
          style={{
            flex: "1",
            overflowX: "visible",
            height: "100%",
          }}
        >
          {items.map((item, index) => {
            return renderRow({
              item,
              index,
            });
          })}

          {query.isFetchingNextPage && (
            <div className="flex justify-center p-4">
              <Spinner />
            </div>
          )}
          <Trigger
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            onRequestNextPage={query.fetchNextPage}
          />
          {query.isSuccess && !query.hasNextPage && items.length > 20 && (
            <Text
              variant="caption-semibold"
              className="text-gray-500 w-full text-center py-2"
            >
              ✨ You've seen it all
            </Text>
          )}
        </VList>
      )}
      {query.isLoading && (
        <div className="flex flex-col items-center h-full justify-center p-4">
          <Spinner />
        </div>
      )}
      {query.isSuccess && !query.hasNextPage && !items.length && (
        <div className="flex flex-1 flex-col gap-4 text-sm font-medium items-center h-full justify-center p-4">
          <img
            src="/images/logo/no_validators.svg"
            className="size-20"
            alt="No validators"
          />
          <span className="text-gray-500">No Validators</span>
        </div>
      )}
    </Table>
  );
};

VirtualizedInfinityTable.displayName = "VirtualizedInfinityTable";
