import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Card } from "@/components/ui/card";
import { OperatorDetails } from "@/components/operator/operator-details";
import { useOperator } from "@/hooks/operator/use-operator";
import type { OperatorID } from "@/types/types";
import { Spinner } from "@/components/ui/spinner";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useOperatorStats } from "@/hooks/operator/use-operator-stats.ts";

export type OperatorStatCardProps = {
  operatorId: OperatorID;
};

type OperatorStatCardFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorStatCardProps> &
  OperatorStatCardProps
>;

export const OperatorStatCard: OperatorStatCardFC = ({
                                                       operatorId,
                                                       className,
                                                       ...props
                                                     }) => {
  const { data: operator, error } = useOperator(operatorId, { options: { retry: false } });
  const res = useOperatorStats(operatorId);
  const isRemovedOperator = error?.message.includes('404') || false;
  const cardVariant = isRemovedOperator ? "disabled" : "default"

  if (!operator && !isRemovedOperator || !res)
    return (
      <Card
        className={cn(className, "min-h-[180.8px] items-center justify-center")}
        {...props}
      >
        <Spinner />
        <Text variant="caption-semibold">
          Operator {operatorId.toString()}...
        </Text>
      </Card>
    );

  return (
    <Card variant={cardVariant} className={cn("flex flex-col p-6 gap-4", className)} {...props}>
      <OperatorDetails isRemovedOperator={isRemovedOperator} operator={operator || {
        id: Number(operatorId),
        name: `Operator ${operatorId}`
      }} />
      <Divider />
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1">
          <Tooltip
            content="Is the operator performing duties for the majority of its validators for the last 2 epochs.">
            <div className="flex items-center gap-2">
              <Text variant="caption-medium">Status</Text>
              <FaCircleInfo className="text-gray-400 size-3" />
            </div>
          </Tooltip>
          <Badge size="sm" variant={res.statusBadgeVariant}>
            {res.status}
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="caption-medium">30D Perform.</Text>
          <Text variant="body-2-semibold">{res.performance}</Text>
        </div>
        <div className="flex flex-col justify-end gap-1 text-end">
          <Text variant="caption-medium">Yearly Fee</Text>
          <Text variant="body-2-semibold">{res.yearlyFee}</Text>
        </div>
      </div>
    </Card>
  );
};

OperatorStatCard.displayName = "OperatorStatCard";
