import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Span, Text } from "@/components/ui/text";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { EstimatedOperationalRunwayAlert } from "@/components/cluster/estimated-operational-runway-alert";
import { useCalculateRunway } from "@/hooks/cluster/use-calculate-runway";
import { bigintAbs } from "@/lib/utils/bigint";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterBurnRate } from "@/hooks/cluster/use-cluster-burn-rate";

export type EstimatedOperationalRunwayProps = {
  clusterHash?: string;
  deltaBalance?: bigint;
};

type EstimatedOperationalRunwayFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof EstimatedOperationalRunwayProps> &
    EstimatedOperationalRunwayProps
>;

export const EstimatedOperationalRunway: EstimatedOperationalRunwayFC = ({
  className,
  clusterHash,
  deltaBalance = 0n,
  ...props
}) => {
  const params = useClusterPageParams();
  const hash = clusterHash || params.clusterHash;

  const clusterRunway = useClusterRunway(hash!, {
    deltaBalance,
  });

  const { data: clusterBurnRate = 0n } = useClusterBurnRate(hash!);

  const hasDeltaBalance = deltaBalance !== 0n;
  const isWithdrawing = deltaBalance < 0n;
  const isDepositing = deltaBalance > 0n;

  const { data: clusterBalance = 0n } = useClusterBalance(hash!);

  const clusterRunwaySnapshot = useCalculateRunway(
    clusterBalance,
    clusterBurnRate,
  );

  const newRunway = useCalculateRunway(
    clusterBalance + deltaBalance,
    clusterBurnRate,
  );

  const deltaRunway = bigintAbs(
    clusterRunwaySnapshot.runway - newRunway.runway,
  );

  return (
    <div className={cn(className, "flex flex-col gap-4")} {...props}>
      <div className="flex flex-col gap-1">
        <Tooltip
          asChild
          content="Estimated amount of days the cluster balance is sufficient to run all it's validators."
        >
          <div className="flex gap-2 w-fit items-center text-gray-500">
            <Text variant="body-2-bold">Est. Operational Runway</Text>
            <FaCircleInfo className="size-3 text-gray-500" />
          </div>
        </Tooltip>
        <div
          className={cn("flex items-end gap-1", {
            "text-error-500": clusterRunway.isAtRisk,
          })}
        >
          <Text variant="headline4">{clusterRunway.runway.toString()} </Text>
          <Text variant="body-2-bold">days</Text>
          {hasDeltaBalance && (
            <Span
              className={cn({
                "text-error-500": isWithdrawing,
                "text-success-500": isDepositing,
              })}
            >
              ({isWithdrawing ? "-" : "+"}
              {deltaRunway.toString()} days)
            </Span>
          )}
        </div>
      </div>
      <EstimatedOperationalRunwayAlert
        isAtRisk={clusterRunway.isAtRisk}
        runway={clusterRunway.runway}
        isWithdrawing={isWithdrawing}
      />
    </div>
  );
};

EstimatedOperationalRunway.displayName = "EstimatedOperationalRunway";
