import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { useParams } from "react-router-dom";

export const OperatorSettings: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const params = useParams<{ id: string }>();
  return (
    <div className={cn(className)} {...props}>
      OperatorSettings [{params.id}]
    </div>
  );
};

OperatorSettings.displayName = "OperatorSettings";
