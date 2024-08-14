import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { useDeclareOperatorFee } from "@/lib/contract-interactions/write/use-declare-operator-fee";
import { Stepper } from "@/components/ui/stepper";
import { useInterval, useSearchParam, useUpdate } from "react-use";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { FeeChange } from "@/components/ui/fee-change";
import { useUpdateOperatorFeeState } from "@/guard/operator-guards";
import { Button } from "@/components/ui/button";
import { roundOperatorFee } from "@/lib/utils/bigint";
import { globals } from "@/config";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { queryClient } from "@/lib/react-query";
import { getGetOperatorDeclaredFeeQueryOptions } from "@/lib/contract-interactions/read/use-get-operator-declared-fee";
import {
  humanizeDuration,
  useOperatorDeclaredFee,
  useOperatorDeclaredFeeStatus,
} from "@/hooks/operator/use-operator-fee-periods";

export const IncreaseOperatorFee: FC = () => {
  const { operatorId } = useOperatorPageParams();
  const status = useOperatorDeclaredFeeStatus(BigInt(operatorId!));
  const { approvalBeginTime, approvalEndTime } = useOperatorDeclaredFee(
    BigInt(operatorId!),
  );
  const a = humanizeDuration(Number(approvalBeginTime * 1000n) - Date.now());
  const b = humanizeDuration(Number(approvalEndTime) * 1000 - Date.now());
  console.log("status:", status, a);

  const update = useUpdate();
  useInterval(update, status !== "declaration" ? 1000 : null);

  const declareOperatorFee = useDeclareOperatorFee();

  const step = Number(useSearchParam("step"));
  const submit = () => {
    declareOperatorFee.write(
      {
        operatorId: BigInt(operatorId!),
        fee: roundOperatorFee(
          useUpdateOperatorFeeState.state.newYearlyFee /
            globals.BLOCKS_PER_YEAR,
        ),
      },
      withTransactionModal({
        onMined: () => {
          queryClient.refetchQueries({
            queryKey: getGetOperatorDeclaredFeeQueryOptions({
              operatorId: BigInt(operatorId!),
            }).queryKey,
          });
        },
      }),
    );
  };

  return (
    <Container variant="vertical">
      <Card className="w-full">
        <div className="flex gap-3 items-center">
          <Text variant="headline4">Update Fee</Text>
          <Badge size="sm" variant="success">
            Declare Fee
          </Badge>
        </div>
        <Stepper
          stepIndex={step}
          steps={[
            {
              variant: status === "declaration" ? "active" : "done",
              label: "Declare Fee",
              addon: (
                <Text className="text-xs font-bold">
                  {new Date().toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Text>
              ),
            },
            {
              variant: status === "waiting" ? "active" : "done",
              label: "Waiting Period",
              addon: status === "waiting" && (
                <Text className="text-xs font-bold text-warning-500">{a}</Text>
              ),
            },
            {
              variant:
                status === "execution-pending"
                  ? "active"
                  : status === "expired"
                    ? "error"
                    : "done",
              label: "Pending Execution",
              addon: status === "execution-pending" && (
                <Text className="text-xs font-bold text-error-500">
                  Expires in {b}
                </Text>
              ),
            },
            {
              variant:
                status === "approved"
                  ? "done"
                  : status === "expired"
                    ? "error"
                    : "default",
              label: "Fee Updated",
            },
          ]}
        />
        <Text>Increasing your operator fee is done in a few steps:</Text>
        <Text>
          Process starts by declaring a new fee, which is followed by waiting
          period in which your managed validators are notified. Once the waiting
          period has past you could finalize your new fee by executing it.
        </Text>
        <FeeChange
          previousFee={useUpdateOperatorFeeState.state.previousYearlyFee}
          newFee={useUpdateOperatorFeeState.state.newYearlyFee}
        />
        <Button
          size="xl"
          isActionBtn
          onClick={submit}
          isLoading={declareOperatorFee.isPending}
        >
          Declare Fee
        </Button>
      </Card>
    </Container>
  );
};

IncreaseOperatorFee.displayName = "IncreaseOperatorFee";
