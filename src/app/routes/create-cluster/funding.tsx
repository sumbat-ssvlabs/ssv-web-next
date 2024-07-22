import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { FundingForm } from "@/components/funding/funding-form";

export type FundingProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof FundingProps> & FundingProps
>;

export const Funding: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      <FundingForm />
    </div>
  );
};

Funding.displayName = "Funding";
