import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useOperator } from "@/hooks/use-operator";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate, useParams } from "react-router-dom";

export const Operator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const params = useParams<{ id: string }>();
  const operator = useOperator(params.id!);
  if (operator.isError) {
    return <Navigate to="/404" />;
  }

  return (
    <Container
      variant="horizontal"
      size="xl"
      {...props}
      className={cn(className)}
    >
      <Card></Card>
      <Card></Card>
    </Container>
  );
};

Operator.displayName = "Operator";
