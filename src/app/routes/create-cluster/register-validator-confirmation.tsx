import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import {
  useRegisterValidatorContext,
  useSelectedOperatorIds,
} from "@/guard/register-validator-guard";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { useOperators } from "@/hooks/operator/use-operators";
import { OperatorDetails } from "@/components/operator/operator-details";
import { formatSSV } from "@/lib/utils/number";
import {
  computeDailyAmount,
  computeLiquidationCollateralCost,
} from "@/lib/utils/keystore";
import { sumOperatorsFee } from "@/lib/utils/operator";
import { Divider } from "@/components/ui/divider";
import { useGetNetworkFee } from "@/lib/contract-interactions/read/use-get-network-fee";
import { useSsvNetworkFee } from "@/hooks/use-ssv-network-fee";
import { Button } from "@/components/ui/button";
import { useRegisterValidator } from "@/lib/contract-interactions/write/use-register-validator";
import { useBulkRegisterValidator } from "@/lib/contract-interactions/write/use-bulk-register-validator";
import {
  createClusterHash,
  formatClusterData,
  getDefaultClusterData,
} from "@/lib/utils/cluster";
import { useAccount } from "wagmi";
import {
  getClusterQueryOptions,
  useCluster,
} from "@/hooks/cluster/use-cluster";
import { bigintifyNumbers } from "@/lib/utils/bigint";
import type { Address } from "abitype";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { retryPromiseUntilSuccess } from "@/lib/utils/promise";
import { getCluster } from "@/api/cluster";
import { queryClient } from "@/lib/react-query";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { WithAllowance } from "@/components/with-allowance/with-allowance";
import { usePaginatedAccountClusters } from "@/hooks/cluster/use-paginated-account-clusters";

export const RegisterValidatorConfirmation: FC = () => {
  const navigate = useNavigate();
  const clusters = usePaginatedAccountClusters();

  const account = useAccount();
  const { shares, depositAmount } = useRegisterValidatorContext();
  const isBulk = shares.length > 1;

  const operatorIds = useSelectedOperatorIds();
  const operators = useOperators(operatorIds);
  const operatorsFee = sumOperatorsFee(operators.data ?? []);
  const operatorsDailyFee = computeDailyAmount(operatorsFee, 1);

  const clusterHash = createClusterHash(account.address!, operatorIds);
  const clusterQuery = useCluster(clusterHash, {
    retry: false,
  });

  const networkFee = useGetNetworkFee();
  const networkDailyFee = computeDailyAmount(networkFee.data ?? 0n, 1);

  const { liquidationThresholdPeriod, minimumLiquidationCollateral } =
    useSsvNetworkFee();

  const liquidationCollateralCost = computeLiquidationCollateralCost({
    liquidationCollateralPeriod: liquidationThresholdPeriod.data ?? 0n,
    minimumLiquidationCollateral: minimumLiquidationCollateral.data ?? 0n,
    networkFee: networkFee.data ?? 0n,
    operatorsFee,
  });

  const registerValidator = useRegisterValidator();
  const bulkRegisterValidator = useBulkRegisterValidator();

  const isWriting =
    registerValidator.isPending || bulkRegisterValidator.isPending;

  const handleRegisterValidator = () => {
    const clusterData = clusterQuery.data
      ? formatClusterData(clusterQuery.data)
      : getDefaultClusterData();
    const [share] = shares;

    const options = withTransactionModal({
      onMined: async () => {
        await retryPromiseUntilSuccess(async () => {
          const cluster = await getCluster(clusterHash);

          return (
            cluster && clusterData.validatorCount !== cluster?.validatorCount
          );
        });

        if (!clusters.clusters.length) {
          await clusters.query.refetch();
        }

        await queryClient.refetchQueries({
          queryKey: getClusterQueryOptions(clusterHash).queryKey,
        });

        return () =>
          navigate(`../success?operatorIds=${operatorIds.join(",")}`);
      },
    });

    if (shares.length === 1)
      return registerValidator.write(
        {
          amount: depositAmount,
          cluster: clusterData,
          operatorIds: bigintifyNumbers(operatorIds),
          publicKey: share.publicKey as Address,
          sharesData: share.sharesData as Address,
        },
        options,
      );

    return bulkRegisterValidator.write(
      {
        amount: depositAmount,
        cluster: clusterData,
        operatorIds: bigintifyNumbers(operatorIds),
        publicKeys: shares.map((share) => share.publicKey as Address),
        sharesData: shares.map((share) => share.sharesData as Address),
      },
      options,
    );
  };

  return (
    <Container variant="vertical" className="py-6">
      <Card className="w-full">
        <div className="flex justify-between w-full">
          <Text variant="headline4">Transaction Details</Text>
          {isBulk && (
            <Badge variant="success">{shares.length} Validators</Badge>
          )}
        </div>
        {shares.length === 1 && (
          <div className="space-y-2">
            <Text variant="body-3-semibold" className="text-gray-500">
              Validator Public Key
            </Text>
            <Input disabled value={shares[0].publicKey} />
          </div>
        )}
        <div className="space-y-2">
          <Text variant="body-3-semibold" className="text-gray-500">
            Selected Operators
          </Text>
          {operators.data?.map((operator) => (
            <div className="flex justify-between" key={operator.public_key}>
              <OperatorDetails operator={operator} />
              <div className="text-end space-y-1">
                <Text variant="body-2-medium">
                  {formatSSV(computeDailyAmount(BigInt(operator.fee), 1))} SSV
                </Text>
                <Text variant="body-3-medium" className="text-gray-500">
                  /1 days
                </Text>
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <div className="space-y-2">
          <Text variant="body-3-semibold" className="text-gray-500">
            Funding Summary
          </Text>
          <div className="flex justify-between">
            <Text variant="body-2-medium">Operators Fee</Text>
            <Text variant="body-2-medium">
              {formatSSV(operatorsDailyFee)} SSV
            </Text>
          </div>
          <div className="flex justify-between">
            <Text variant="body-2-medium">Network Fee</Text>
            <Text variant="body-2-medium">
              {formatSSV(networkDailyFee)} SSV
            </Text>
          </div>
          <div className="flex justify-between">
            <Text variant="body-2-medium">Liquidation Collateral</Text>
            <Text variant="body-2-medium">
              {formatSSV(liquidationCollateralCost)} SSV
            </Text>
          </div>
        </div>
        <Divider />
        <div className="flex justify-between">
          <Text variant="body-2-medium">Total</Text>
          <Text variant="body-2-medium">
            {formatSSV(
              liquidationCollateralCost + networkDailyFee + operatorsDailyFee,
            )}
            SSV
          </Text>
        </div>
        <WithAllowance size="xl" amount={depositAmount}>
          <Button
            size="xl"
            isLoading={isWriting}
            isActionBtn
            disabled={isWriting}
            onClick={handleRegisterValidator}
          >
            Register Validator
          </Button>
        </WithAllowance>
      </Card>
    </Container>
  );
};

RegisterValidatorConfirmation.displayName = "RegisterValidatorConfirmation";
