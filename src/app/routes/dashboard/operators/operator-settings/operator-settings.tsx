import { useGetOperatorById } from "@/lib/contract-interactions/read/use-get-operator-by-id";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useParams } from "react-router-dom";

export const OperatorSettings: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const params = useParams<{ id: string }>();
  const { data } = useGetOperatorById({
    operatorId: BigInt(params.id!),
  });
  console.log("data:", data);
  return (
    <div className={cn(className)} {...props}>
      OperatorSettings [{params.id}]
    </div>
  );
};

OperatorSettings.displayName = "OperatorSettings";
