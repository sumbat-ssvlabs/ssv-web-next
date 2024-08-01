import { OperatorDetails } from "@/components/operator/operator-details";
import { OperatorSettingsBtn } from "@/components/operator/operator-settings-btn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { useOperator } from "@/hooks/use-operator";
import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";

export const Operator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { operatorId } = useParams<{ operatorId: string }>();
  const operator = useOperator(operatorId!);

  const earnings = useGetOperatorEarnings({ id: BigInt(operatorId!) });
  const balance = earnings.data ?? 0n;

  if (operator.isLoading)
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-full  pb-6">
        <img src="/images/ssv-loader.svg" className="size-36" />
      </div>
    );

  return (
    <>
      <Helmet>
        <title>SSV {operator.data?.name ?? ""}</title>
      </Helmet>
      <div className="flex flex-col gap-6">
        <div className="bg-gray-100 w-full h-[208px]">
          <Container size="xl" variant="vertical" className="pt-6">
            <div className="flex w-full items-center justify-between">
              <NavigateBackBtn>Operators</NavigateBackBtn>
              <OperatorSettingsBtn />
            </div>
            <div className="flex items-end flex-1 gap-20">
              <div className="flex flex-col gap-2">
                <Text variant="body-3-medium" className="text-gray-500">
                  Name
                </Text>
                <OperatorDetails id={Number(operatorId)} />
              </div>{" "}
              <div className="flex flex-col gap-2">
                <Text variant="body-3-medium" className="text-gray-500">
                  Status
                </Text>
                <OperatorDetails id={Number(operatorId)} />
              </div>{" "}
              <div className="flex flex-col gap-2">
                <Text variant="body-3-medium" className="text-gray-500">
                  Validators
                </Text>
                <OperatorDetails id={Number(operatorId)} />
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
              <Text variant="headline4" className="text-gray-500">
                Annual Fee
              </Text>
              <Text variant="headline3">20 SSV</Text>
              <Button variant="secondary" size="xl">
                Update Fee
              </Button>
            </Card>
          </div>
          <Card className="flex-[2]">
            <Text variant="headline3" className="text-gray-500">
              Operator Details
            </Text>
          </Card>
        </Container>
      </div>
    </>
  );
};

Operator.displayName = "Operator";
