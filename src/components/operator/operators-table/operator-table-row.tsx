import { OperatorDetails } from "@/components/operator/operator-details";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { formatSSV, percentageFormatter } from "@/lib/utils/number";
import { getYearlyFee } from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";
import { BiRightArrow } from "react-icons/bi";

export type OperatorTableRowProps = {
  operator: Operator;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof OperatorTableRowProps> &
    OperatorTableRowProps
>;

export const OperatorTableRow: FCProps = ({
  operator,
  className,
  ...props
}) => {
  const balance = useGetOperatorEarnings({
    id: BigInt(operator.id),
  });

  return (
    <TableRow
      key={operator.id}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      <TableCell className="font-medium">
        <OperatorDetails operator={operator} />
      </TableCell>
      <TableCell>
        <Badge variant="multi-select">{operator.status}</Badge>
      </TableCell>
      <TableCell>
        {percentageFormatter.format(operator.performance["30d"])}
      </TableCell>
      <TableCell>{formatSSV(balance.data ?? 0n)} SSV</TableCell>
      <TableCell>
        {getYearlyFee(BigInt(operator.fee), { format: true })}
      </TableCell>
      <TableCell>{operator.validators_count}</TableCell>
      <TableCell className="">
        <BiRightArrow />
      </TableCell>
    </TableRow>
  );
};

OperatorTableRow.displayName = "OperatorTableRow";
