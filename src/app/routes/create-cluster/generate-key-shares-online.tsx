import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export type GenerateKeySharesOnlineProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof GenerateKeySharesOnlineProps> &
    GenerateKeySharesOnlineProps
>;

export const GenerateKeySharesOnline: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      GenerateKeySharesOnline
    </div>
  );
};

GenerateKeySharesOnline.displayName = "GenerateKeySharesOnline";
