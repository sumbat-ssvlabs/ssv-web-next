import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const NoYourOperator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      NoYourOperator
    </div>
  );
};

NoYourOperator.displayName = "NoYourOperator";
