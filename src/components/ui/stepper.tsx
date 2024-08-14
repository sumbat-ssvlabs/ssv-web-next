import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import {
  Fragment,
  useMemo,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

export const stepperDotVariants = cva(
  "flex items-center justify-center size-6 text-xs font-bold rounded-full",
  {
    variants: {
      variant: {
        default: "bg-gray-300",
        active: "border-4 border-primary-500",
        done: "bg-primary-500 text-white",
        error: "bg-error-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type StepperDotProps = VariantProps<typeof stepperDotVariants> & {
  step: number;
};

type StepperDotFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof StepperDotProps | "children"> &
    StepperDotProps
>;

export const StepperDot: StepperDotFC = ({
  className,
  variant,
  step,
  ...props
}) => {
  const children = useMemo(() => {
    switch (variant) {
      case "default":
        return step;
      case "done":
        return <Check className="size-3" strokeWidth="4" />;
      case "error":
        return <X className="size-3" strokeWidth="4" />;
    }
  }, [step, variant]);

  return (
    <div className={cn(stepperDotVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
};

export type StepperProps = {
  steps: {
    variant?: StepperDotProps["variant"];
    label: string;
    addon?: ReactNode;
  }[];
  stepIndex: number;
};

type StepperFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof StepperProps | "children"> &
    StepperProps
>;

export const Stepper: StepperFC = ({
  className,
  steps,
  stepIndex,
  ...props
}) => {
  const getVariant = (index: number) => {
    if (index < stepIndex) return "done";
    if (index === stepIndex) return "active";
    return "default";
  };
  return (
    <div className={cn(className, "flex flex-col gap-2")} {...props}>
      <div className="flex items-center gap-2 justify-between">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <StepperDot
              variant={step.variant ?? getVariant(index)}
              step={index + 1}
            />
            {index < steps.length - 1 && (
              <div
                className={cn("h-[3px] flex-1 rounded-full", {
                  "bg-gray-300":
                    (step.variant ?? getVariant(index)) !== "error",
                  "bg-error-500":
                    (step.variant ?? getVariant(index)) === "error",
                })}
              />
            )}
          </Fragment>
        ))}
      </div>
      <div className="flex gap-2 justify-evenly">
        {steps.map((step, index) => (
          <div
            key={`${index}-label`}
            className={cn("flex flex-col gap-1", {
              "flex-[3.5]":
                steps.length > 3 && index > 0 && index < steps.length - 1,
              "flex-[2]":
                steps.length <= 3 || index === 0 || index === steps.length - 1,
              "text-left": index === 0,
              "text-right": index === steps.length - 1,
              "text-center": index > 0 && index < steps.length - 1,
            })}
          >
            <Text
              variant="body-3-medium"
              className={cn({
                "font-bold": stepIndex === index,
              })}
            >
              {step.label}
            </Text>
            {step.addon}
          </div>
        ))}
      </div>
    </div>
  );
};
