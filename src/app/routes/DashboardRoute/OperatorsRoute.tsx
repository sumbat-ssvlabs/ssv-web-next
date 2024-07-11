import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const OperatorsRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      OperatorsRoute
    </div>
  );
};

OperatorsRoute.displayName = "OperatorsRoute";
