import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useOperator } from "@/hooks/use-operator";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Link, useParams } from "react-router-dom";

export const Operator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const params = useParams<{ id: string }>();
  const operator = useOperator(params.id!);

  if (operator.isLoading)
    return (
      <div className="flex flex-col gap-6 h-full  pb-6">
        <Skeleton className="rounded-2xl w-full h-[208px]" />
        <Container variant="horizontal" className="flex-1" size="xl" {...props}>
          <div className="flex flex-1 gap-6 flex-col">
            <Skeleton className="rounded-2xl flex-1" />
            <Skeleton className="rounded-2xl flex-1" />
          </div>
          <Skeleton className="rounded-2xl flex-[2] h-full" />
        </Container>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gray-100 w-full h-[208px]">
        <Container size="xl">
          <NavigateBackBtn>Operators</NavigateBackBtn>
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
            <Text variant="headline3" className="text-gray-500">
              Balance
            </Text>
            <Text variant="headline1">0.01 SSV</Text>

            <Button as={Link} to="withdraw" variant="default" size="xl">
              Withdraw
            </Button>
          </Card>
          <Card className="w-full">
            <Text variant="headline3" className="text-gray-500">
              Annual Fee
            </Text>
            <Text variant="headline1">20 SSV</Text>
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
  );
};

Operator.displayName = "Operator";
