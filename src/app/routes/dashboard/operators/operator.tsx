import { OperatorDetails } from "@/components/operator/operator-details";
import { OperatorSettingsBtn } from "@/components/operator/operator-settings-btn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useOperator } from "@/hooks/operator/use-operator";
import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { useGetOperatorFee } from "@/lib/contract-interactions/read/use-get-operator-fee";
import { formatSSV, percentageFormatter } from "@/lib/utils/number";
import { getYearlyFee } from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Helmet } from "react-helmet";
import { FaCircleInfo } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { IncreaseOperatorFeeStatusBadge } from "@/components/operator/increase-operator-fee/increase-operator-fee-status-badge";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { useInfiniteOperatorValidators } from "@/hooks/operator/use-paginated-operator-validators";
import { shortenAddress } from "@/lib/utils/strings";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";

export const Operator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const params = useOperatorPageParams();
  const operatorId = BigInt(params.operatorId!);
  const operator = useOperator(operatorId!);

  const earnings = useGetOperatorEarnings({ id: operatorId });

  const fee = useGetOperatorFee({ operatorId });
  const yearlyFee = getYearlyFee(fee.data ?? 0n);
  const balance = earnings.data ?? 0n;

  const { validators } = useInfiniteOperatorValidators(Number(operatorId));
  console.log("validators:", validators);

  if (!operator.data) return null;

  return (
    <>
      <Helmet>
        <title>SSV {operator.data?.name ?? ""}</title>
      </Helmet>
      <div className="flex flex-col gap-6">
        <div className="bg-gray-100 w-full h-[208px]">
          <Container size="xl" variant="vertical" className="pt-6">
            <div className="flex w-full items-center justify-between">
              <NavigateBackBtn>Operator Details</NavigateBackBtn>
              <OperatorSettingsBtn />
            </div>
            <div className="flex items-start flex-1 gap-20">
              <div className="flex flex-col gap-2">
                <Text variant="body-3-medium" className="text-gray-500">
                  Name
                </Text>
                <OperatorDetails operator={operator.data} />
              </div>{" "}
              <div className="flex flex-col gap-2">
                <Tooltip content="Is the operator performing duties for the majority of its validators for the last 2 epochs.">
                  <div className="flex gap-2 items-center">
                    <Text variant="body-3-medium" className="text-gray-500">
                      Status
                    </Text>
                    <FaCircleInfo className="size-3 text-gray-500" />
                  </div>
                </Tooltip>
                <Badge size="sm" variant="multi-select">
                  {operator.data.status}
                </Badge>
              </div>{" "}
              <div className="flex flex-col gap-2">
                <Text variant="body-3-medium" className="text-gray-500">
                  Validators
                </Text>
                <Text variant="body-2-medium">
                  {operator.data.validators_count}
                </Text>
              </div>
              <div className="flex flex-col gap-2">
                <Text variant="body-3-medium" className="text-gray-500">
                  30D Performance
                </Text>
                <Text variant="body-2-medium">
                  {percentageFormatter.format(operator.data.performance["30d"])}
                </Text>
              </div>
            </div>
          </Container>
        </div>
        <Container
          variant="horizontal"
          size="xl"
          {...props}
          className={cn(className)}
        >
          <div className="flex items-stretch gap-6 flex-col flex-1">
            <Card className="w-full">
              <Text variant="headline4" className="text-gray-500">
                Balance
              </Text>
              <Text variant="headline3">{formatSSV(balance)} SSV</Text>

              <Button as={Link} to="withdraw" variant="default" size="xl">
                Withdraw
              </Button>
            </Card>
            <Card className="w-full">
              <div className="flex w-full justify-between items-center">
                <Text variant="headline4" className="text-gray-500">
                  Annual Fee
                </Text>
                <IncreaseOperatorFeeStatusBadge />
              </div>
              <Text variant="headline3">{formatSSV(yearlyFee)} SSV</Text>
              <Button as={Link} to="fee/update" variant="secondary" size="xl">
                Update Fee
              </Button>
            </Card>
          </div>
          <Card className="flex-[2] max-h-[600px] overflow-auto">
            <Text variant="headline4" className="text-gray-500">
              Validators
            </Text>
            <VirtualizedInfinityTable
              items={validators}
              headers={["Address", "Status", ""]}
              renderRow={({ item }) => (
                <TableRow key={item.cluster}>
                  <TableCell>{shortenAddress(item.public_key)}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="subtle" size="icon" className="size-7">
                        <SsvExplorerBtn validatorId={item.public_key} />
                      </Button>
                      <Button size="icon" variant="subtle" className="size-7">
                        <FaCircleInfo className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            />
          </Card>
        </Container>
      </div>
    </>
  );
};

Operator.displayName = "Operator";
