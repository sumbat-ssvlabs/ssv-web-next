import type { FC, ComponentPropsWithoutRef } from "react";
import { CopyBtn } from "@/components/ui/copy-btn";
import { TableRow, TableCell } from "@/components/ui/grid-table";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import { shortenAddress } from "@/lib/utils/strings";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { useInfiniteOperatorValidators } from "@/hooks/operator/use-paginated-operator-validators";

export const OperatorValidatorsList: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { validators, infiniteQuery } = useInfiniteOperatorValidators();
  return (
    <VirtualizedInfinityTable
      gridTemplateColumns="220px minmax(200px, auto) 50px"
      {...props}
      query={infiniteQuery}
      headers={["Name", "Status", ""]}
      items={validators}
      renderRow={({ index, item }) => (
        <TableRow key={index}>
          <TableCell className="flex gap-2 items-center">
            <Text>{shortenAddress(item.public_key)}</Text>
            <CopyBtn variant="subtle" text={item.public_key} />
          </TableCell>
          <TableCell>
            <Badge variant="error" size="sm">
              {item.status}
            </Badge>
          </TableCell>
          <TableCell className="flex justify-end">
            <SsvExplorerBtn validatorId={item.public_key} />
          </TableCell>
        </TableRow>
      )}
    />
  );
};

OperatorValidatorsList.displayName = "OperatorValidatorsList";
