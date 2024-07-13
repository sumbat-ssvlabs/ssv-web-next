import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Link } from "react-router-dom";
import { useRemoveOperator } from "@/lib/contract-interactions/write/use-remove-operator-ts";

export const Operator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const data = useRemoveOperator();
  console.log("data:", data);
  return (
    <div className={cn(className)} {...props}>
      Operator
      <Link to="settings">1</Link>
    </div>
  );
};

Operator.displayName = "Operator";
