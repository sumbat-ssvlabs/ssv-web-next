import { FundingForm } from "@/components/funding/funding-form";
import { cn } from "@/lib/utils/tw";
import { createValidatorFlow } from "@/signals/create-cluster-signals";
import type { ComponentProps, ComponentPropsWithoutRef, FC } from "react";

export type FundingProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof FundingProps> & FundingProps
>;

export const Funding: FCProps = ({ className, ...props }) => {
  const handleSubmit: ComponentProps<typeof FundingForm>["onSubmit"] = async ({
    days,
  }) => {
    console.log("createValidatorFlow:", createValidatorFlow.peek());
    console.log("days:", days);
  };

  return (
    <div className={cn(className)} {...props}>
      <FundingForm onSubmit={handleSubmit} />
    </div>
  );
};

Funding.displayName = "Funding";
