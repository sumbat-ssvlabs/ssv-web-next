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
import { useOperatorDeclaredFeeStatus } from "../../../../../hooks/operator/use-operator-fee-periods";

export const IncreaseOperatorFee: FC = () => {
  const update = useUpdate();
  useInterval(update, 1000);

  const { operatorId } = useOperatorPageParams();
  const declareOperatorFee = useDeclareOperatorFee();

  const step = Number(useSearchParam("step"));
  const status = useOperatorDeclaredFeeStatus(BigInt(operatorId!));
  console.log("status:", status);
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
              label: "Waiting Period",
            },
            {
              label: "Pending Execution",
            },
            {
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
