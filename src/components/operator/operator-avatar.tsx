import { cn } from "@/lib/utils/tw";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, FC } from "react";
import { MdOutlineLock } from "react-icons/md";

export const variants = cva("object-cover", {
  variants: {
    variant: {
      circle:
        "rounded-full outline outline-1 outline-offset-[3px] outline-gray-300",
      square: "rounded-lg",
    },
    size: {
      sm: "size-6",
      md: "size-8",
      lg: "size-12",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "square",
  },
});

export type OperatorAvatarProps = {
  src?: string;
  isPrivate?: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorAvatarProps> &
    OperatorAvatarProps &
    VariantProps<typeof variants>
>;

export const OperatorAvatar: FCProps = ({
  src,
  className,
  isPrivate,
  size,
  variant,
  ...props
}) => {
  return (
    <div className={cn(className, "relative select-none")} {...props}>
      {isPrivate && (
        <div className="absolute flex items-center justify-center left-0 top-0 -m-2 bg-gray-50 text-gray-800 rounded-full size-7 border">
          <MdOutlineLock className="size-4" />
        </div>
      )}
      <img
        className={cn(variants({ size, variant }))}
        src={src || "/images/operator_default_background/light.svg"}
      />
    </div>
  );
};

OperatorAvatar.displayName = "OperatorAvatar";
