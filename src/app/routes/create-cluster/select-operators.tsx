import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { OperatorPicker } from "@/components/operator/operator-picker/operator-picker";

export type SelectOperatorsProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectOperatorsProps> &
    SelectOperatorsProps
>;

export const SelectOperators: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className, "h-full")} {...props}>
      <OperatorPicker />
    </div>
  );
};

SelectOperators.displayName = "SelectOperators";
