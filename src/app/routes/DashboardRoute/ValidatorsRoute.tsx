import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const ValidatorsRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      ValidatorsRoute
    </div>
  );
};

ValidatorsRoute.displayName = "ValidatorsRoute";
