import { cn } from "@/lib/utils/tw";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, FC } from "react";
import { MdOutlineLock } from "react-icons/md";

export const variants = cva("object-cover", {
  variants: {
    size: {
      sm: "size-6 rounded-lg",
      md: "size-8 rounded-lg",
      lg: "size-12 rounded-lg",
    },
  },
  defaultVariants: {
    size: "md",
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
  ...props
}) => {
  return (
    <div className={cn(className, "relative")} {...props}>
      {isPrivate && (
        <div className="absolute flex items-center justify-center left-0 top-0 -m-2 bg-gray-50 rounded-full size-7 border">
          <MdOutlineLock className="size-4" />
        </div>
      )}
      <img
        className={cn(variants({ size }))}
        src={src || "/images/operator_default_background/light.svg"}
      />
    </div>
  );
};

OperatorAvatar.displayName = "OperatorAvatar";
