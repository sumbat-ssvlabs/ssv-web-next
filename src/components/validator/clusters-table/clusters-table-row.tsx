import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { OperatorDetails } from "@/components/operator/operator-details";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { useOptimisticOrProvidedOperator } from "@/hooks/operator/use-optimistic-operator";
import { shortenAddress } from "@/lib/utils/strings";
import { cn } from "@/lib/utils/tw";
import type { Cluster } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";
import { HiArrowRight } from "react-icons/hi";

export type ClustersTableRowProps = {
  cluster: Cluster;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof ClustersTableRowProps> &
    ClustersTableRowProps
>;

export const ClustersTableRow: FCProps = ({ cluster, className, ...props }) => {
  return (
    <TableRow
      key={cluster.id}
      className={cn("cursor-pointer max-h-7", className)}
      {...props}
    >
      <TableCell className="font-bold">
        {shortenAddress(cluster.clusterId, 6)}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-3">
          {cluster.operators.map((o) => {
            const Cmp: FC = () => {
              const operator = useOptimisticOrProvidedOperator(o);
              return (
                <Tooltip
                  content={
                    <OperatorDetails className="dark" operator={operator} />
                  }
                >
                  <OperatorAvatar
                    src={operator.logo}
                    isPrivate={operator.is_private}
                    size="md"
                    variant="circle"
                  />
                </Tooltip>
              );
            };

            return <Cmp key={o.id} />;
          })}
        </div>
      </TableCell>
      <TableCell>{cluster.validatorCount}</TableCell>
      <TableCell>30 days</TableCell>
      <TableCell />
      <TableCell />
      <TableCell className="">
        <HiArrowRight className="size-4 text-gray-500" />
      </TableCell>
    </TableRow>
  );
};

ClustersTableRow.displayName = "ClustersTableRow";
