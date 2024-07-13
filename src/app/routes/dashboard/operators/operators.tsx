import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Link } from "react-router-dom";

export const Operators: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      OperatorsRoute
      <Link to="/operator/1">1</Link>
    </div>
  );
};

Operators.displayName = "Operators";
