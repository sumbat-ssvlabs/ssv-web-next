import { OperatorPicker } from "@/features/operator/operator-picker/operator-picker";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";

export const Operators: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "flex flex-col h-full")} {...props}>
      <OperatorPicker className="flex-1" />
    </div>
  );
};

Operators.displayName = "Operators";
