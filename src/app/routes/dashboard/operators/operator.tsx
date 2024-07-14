import { useOperator } from "@/lib/hooks/get-operator";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Link } from "react-router-dom";

export const Operator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const operator = useOperator(473);
  console.log("operator:", operator.data);
  return (
    <div className={cn(className)} {...props}>
      Operator
      <Link to="settings">1</Link>
      <pre>{JSON.stringify(operator.data, null, 2)}</pre>
    </div>
  );
};

Operator.displayName = "Operator";
