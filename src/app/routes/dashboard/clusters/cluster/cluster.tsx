import { ClusterValidatorsList } from "@/components/cluster/cluster-validators-list";
import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { OperatorStatCard } from "@/components/operator/operator-stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Spacer } from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useIsLiquidated } from "@/lib/contract-interactions/read/use-is-liquidated";
import { formatClusterData } from "@/lib/utils/cluster";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { PlusIcon } from "lucide-react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

export const Cluster: FC = () => {
  const account = useAccount();
  const { clusterHash } = useClusterPageParams();
  const cluster = useCluster(clusterHash!);
  const balance = useClusterBalance(clusterHash!);

  const isLiquidated = useIsLiquidated(
    {
      cluster: formatClusterData(cluster.data!),
      clusterOwner: account.address!,
      operatorIds: cluster.data?.operators.map((id) => BigInt(id)) ?? [],
    },
    {
      enabled: Boolean(cluster.data && account.address),
    },
  );

  const { data: runway } = useClusterRunway(clusterHash!);

  return (
    <Container variant="vertical" size="xl" className="h-full py-6">
      <NavigateBackBtn />
      <div className="grid grid-cols-4 gap-6 w-full">
        {cluster.data?.operators.map((operatorId) => (
          <OperatorStatCard
            key={operatorId}
            className="w-full"
            operatorId={operatorId}
          />
        ))}
      </div>
      <div className="flex flex-1 items-start gap-6 w-full">
        <Card className="flex-[1]">
          <div className="flex flex-col gap-2 ">
            <div className="flex gap-2 items-center">
              <Text variant="headline4" className="text-gray-500">
                Balance
              </Text>
              {isLiquidated.data && <Badge variant="error">Liquidated</Badge>}
            </div>
            <Text
              variant="headline1"
              className={cn({
                "text-error-500": runway?.isAtRisk,
              })}
            >
              {formatSSV(balance.data || 0n)}
            </Text>
          </div>
          <Divider />
          <EstimatedOperationalRunway />
          <Divider />
          <div className="flex gap-4 [&>*]:flex-1">
            <Button as={Link} to="deposit" size="xl">
              Deposit
            </Button>
            <Button as={Link} to="withdraw" size="xl" variant="secondary">
              Withdraw
            </Button>
          </div>
        </Card>
        <Card className="flex-[2] h-full">
          <div className="flex w-full justify-between">
            <Text variant="headline4" className="text-gray-500">
              Validators
            </Text>
            <Spacer />
            <Button as={Link} to="add/distribution-method">
              <Text>Add Validator</Text> <PlusIcon className="size-4" />
            </Button>
          </div>
          <ClusterValidatorsList className="min-h-96" />
        </Card>
      </div>
    </Container>
  );
};

Cluster.displayName = "Cluster";
