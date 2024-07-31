import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { NumberInput } from "@/components/ui/number-input";
import { Text } from "@/components/ui/text";
import { useOperator } from "@/hooks/use-operator";
import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { useWithdrawOperatorEarnings } from "@/lib/contract-interactions/write/use-withdraw-operator-earnings";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { transactionModalProxy } from "@/signals/modal";
import { useState, type ComponentPropsWithoutRef, type FC } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";

export const WithdrawOperatorBalance: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const params = useParams<{ id: string }>();

  const { data: operator } = useOperator();
  const operatorEarnings = useGetOperatorEarnings({
    id: BigInt(params.id!),
  });

  const max = operatorEarnings.data ?? 0n;
  const [value, setValue] = useState(0n);

  const withdraw = useWithdrawOperatorEarnings({
    onConfirmationError: (err) => {
      console.log("err:", Object.values(err));
    },
  });

  return (
    <Container variant="vertical" className={cn(className, "py-6")} {...props}>
      <Helmet>
        <title>Withdraw {operator?.name}</title>
      </Helmet>
      <NavigateBackBtn>{operator?.name}</NavigateBackBtn>
      <Card className="w-full">
        <Text variant="headline4" className="text-gray-500">
          Available Balance
        </Text>
        <Text variant="headline1">{formatSSV(max)} SSV</Text>
      </Card>
      <Card className="w-full">
        <Text variant="headline4" className="text-gray-500">
          Withdraw
        </Text>
        <NumberInput
          className="text-xl h-16 font-bold"
          value={value}
          onChange={setValue}
          max={max}
          rightSlot={
            <div className="flex items-center gap-3 px-3">
              <Button
                size="sm"
                className="px-4"
                variant="secondary"
                onClick={() => setValue(max)}
              >
                Max
              </Button>
              <Text>SSV</Text>
            </div>
          }
        />
        <Button
          isActionBtn
          isLoading={withdraw.isLoading}
          onClick={() => {
            transactionModalProxy.openModal({
              hash: "0x0564987",
            });
            // withdraw.write({ amount: value, operatorId: BigInt(params.id!) });
          }}
          size="xl"
        >
          Withdraw
        </Button>
      </Card>
    </Container>
  );
};

WithdrawOperatorBalance.displayName = "WithdrawOperatorBalance";
