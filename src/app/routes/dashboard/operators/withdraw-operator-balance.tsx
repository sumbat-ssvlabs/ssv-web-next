import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { useOperator } from "@/hooks/use-operator";

export const WithdrawOperatorBalance: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { data: operator } = useOperator();
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
          <Text variant="headline1">0.01 SSV</Text>
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
