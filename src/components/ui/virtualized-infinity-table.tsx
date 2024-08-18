import type { ReactNode } from "react";
import { type ComponentPropsWithoutRef } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import type { UseInfiniteQueryResult } from "@tanstack/react-query";

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
  query?: TQuery;
};

type Props<T> = Omit<
  ComponentPropsWithoutRef<"div">,
  keyof VirtualizedInfinityTableProps<T>
> &
  VirtualizedInfinityTableProps<T>;

export const VirtualizedInfinityTable = <T,>({
  items,
  headers,
  renderRow,
}: Props<T>) => {
  return (
    <Table>
      <TableHeader>
        {headers.map((header, index) => (
          <TableHead key={index}>{header}</TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {items.map((item, index) => {
          return renderRow({
            item,
            index,
          });
        })}
      </TableBody>
    </Table>
  );
};

VirtualizedInfinityTable.displayName = "VirtualizedInfinityTable";
