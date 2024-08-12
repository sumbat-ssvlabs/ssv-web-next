import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export type ValidatorsListProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ValidatorsListProps> &
    ValidatorsListProps
>;

export const ValidatorsList: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      ValidatorsList
    </div>
  );
};

ValidatorsList.displayName = "ValidatorsList";
