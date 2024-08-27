import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import {
  useRegisterValidatorContext,
  useSelectedOperators,
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

export const RegisterValidatorConfirmation: FC = () => {
  const { shares } = useRegisterValidatorContext();
  const operatorIds = useSelectedOperators();

  const networkFee = useGetNetworkFee();
  const networkDailyFee = computeDailyAmount(networkFee.data ?? 0n, 1);

  const operators = useOperators(operatorIds);
  const operatorsFee = sumOperatorsFee(operators.data ?? []);
  const operatorsDailyFee = computeDailyAmount(operatorsFee, 1);

  const { liquidationThresholdPeriod, minimumLiquidationCollateral } =
    useSsvNetworkFee();

  const liquidationCollateralCost = computeLiquidationCollateralCost({
    liquidationCollateralPeriod: liquidationThresholdPeriod.data ?? 0n,
    minimumLiquidationCollateral: minimumLiquidationCollateral.data ?? 0n,
    networkFee: networkFee.data ?? 0n,
    operatorsFee,
  });

  return (
    <Container variant="vertical">
      <Card className="w-full">
        <Text variant="headline4">Transaction Details</Text>
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
      </Card>
    </Container>
  );
};

RegisterValidatorConfirmation.displayName = "RegisterValidatorConfirmation";
