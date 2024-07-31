import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const OperatorNotFound: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      OperatorNotFound
    </div>
  );
};

OperatorNotFound.displayName = "OperatorNotFound";
