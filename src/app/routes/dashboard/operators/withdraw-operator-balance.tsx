import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { useOperator } from "@/hooks/use-operator";
import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
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

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gray-100 w-full">
        <Container>
          <NavigateBackBtn>{operator?.name}</NavigateBackBtn>
        </Container>
      </div>
      <Container variant="vertical" className={cn(className)} {...props}>
        <Card className="w-full">
          <Text variant="headline3" className="text-gray-500">
            Available Balance
          </Text>
          <Text variant="headline1">
            {formatSSV(operatorEarnings.data ?? 0n)} SSV
          </Text>
        </Card>
        <Card className="w-full">
          <Text variant="headline3" className="text-gray-500">
            Available Balance
          </Text>
          <Text variant="headline1">0.01 SSV</Text>
        </Card>
      </Container>
    </div>
  );
};

WithdrawOperatorBalance.displayName = "WithdrawOperatorBalance";
