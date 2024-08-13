import type { FC, ComponentPropsWithoutRef } from "react";
import type { Operator, Pagination as IPagination } from "@/types/api";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { Pagination } from "@/components/ui/pagination";
import { OperatorTableRow } from "@/components/operator/operators-table/operator-table-row";
import { queryClient } from "@/lib/react-query";
import { getOperatorQueryOptions } from "@/hooks/use-operator";

export type OperatorsTableProps = {
  operators: Operator[];
  onOperatorClick: (operator: Operator) => void;
  pagination: IPagination;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof OperatorsTableProps> &
    OperatorsTableProps
>;

export const OperatorsTable: FCProps = ({
  operators,
  onOperatorClick,
  pagination,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table className={cn(className, "w-full")} {...props}>
        <TableHeader>
          <TableRow className="bg-gray-100 text-xs text-gray-500">
            <TableHead>Operator name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>30D Performance</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Yearly Fee</TableHead>
            <TableHead>Validators</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {operators.map((operator) => {
            const { queryKey } = getOperatorQueryOptions(operator.id);
            const cachedOperator = queryClient.getQueryData(queryKey);
            if (cachedOperator?.is_deleted) return null;

            return (
              <OperatorTableRow
                key={operator.id}
                operator={operator}
                onClick={() => {
                  console.log(operator);
                  return onOperatorClick(operator);
                }}
              />
            );
          })}
        </TableBody>
      </Table>
      {pagination.pages > 1 && (
        <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl">
          <Pagination
            pagination={{
              page: 1,
              pages: 12,
              total: 100,
              per_page: 10,
            }}
          />
        </div>
      )}
    </div>
  );
};

OperatorsTable.displayName = "OperatorsTable";
