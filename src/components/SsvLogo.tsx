import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const SsvLogo: FC<ComponentPropsWithoutRef<"img">> = ({
  className,
  ...props
}) => {
  return (
    <img className={cn(className)} {...props} src="/images/logo/dark.svg" />
  );
};

SsvLogo.displayName = "SsvLogo";
