import { type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { Divider } from "@/components/ui/divider";
import { ClusterBalance } from "@/components/cluster/cluster-balance";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { EstimatedOperationalRunwayAlert } from "@/components/cluster/estimated-operational-runway-alert";
import { UnmountClosed } from "react-collapse";
import { Link } from "react-router-dom";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";

export const AdditionalFunding: FC = () => {
  const params = useClusterPageParams();

  const { depositAmount } = useRegisterValidatorContext();

  const { data: clusterRunway } = useClusterRunway(params.clusterHash!, {
    deltaBalance: depositAmount,
    deltaValidators: 1n,
  });

  return (
    <Container variant="vertical" className="p-6">
      <Card>
        <Text variant="headline4">Select your validator funding period</Text>
        <Text>
          Adding a new validator increases your operational costs and decreases
          the cluster's operational runway.
        </Text>
        <Text variant="headline4">
          Would you like to top - up your balance?
        </Text>
        <Card className="rounded-xl bg-gray-200 w-full border border-gray-300">
          <ClusterBalance deltaBalance={depositAmount} />
          <Divider />
          <EstimatedOperationalRunway
            withAlerts={false}
            deltaValidators={1n}
            deltaBalance={depositAmount}
          />
        </Card>
        <div className="space-y-4">
          <Card className="rounded-xl flex items-start  w-full border border-gray-300">
            <div className="flex gap-2">
              <input type="radio" />
              <Text variant="body-1-medium">No - use current balance</Text>
            </div>
          </Card>
          <Card className="rounded-xl flex items-start  w-full border border-gray-300">
            <div className="flex gap-2">
              <input type="radio" />
              <Text variant="body-1-medium">Top up balance</Text>
            </div>
            <NumberInput
              value={depositAmount}
              onChange={(value) => {
                useRegisterValidatorContext.state.depositAmount = value;
              }}
              rightSlot={<>SSV</>}
            />
          </Card>
        </div>
        <UnmountClosed isOpened={Boolean(clusterRunway?.isAtRisk)}>
          <EstimatedOperationalRunwayAlert
            isAtRisk={Boolean(clusterRunway?.isAtRisk)}
            isWithdrawing={false}
            hasDeltaValidators={true}
            runway={clusterRunway?.runway || 0n}
          />
        </UnmountClosed>
        <Button
          as={Link}
          to="../confirmation"
          size="xl"
          disabled={clusterRunway?.isAtRisk}
        >
          Next
        </Button>
      </Card>
    </Container>
  );
};

AdditionalFunding.displayName = "AdditionalFunding";
