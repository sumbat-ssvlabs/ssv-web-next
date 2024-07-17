import { cn } from "@/lib/utils/tw";
import { type ComponentPropsWithoutRef, type FC } from "react";

export const Operators: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "flex flex-col h-full")} {...props}></div>
  );
};

Operators.displayName = "Operators";
