import type { FC } from "react";
import { TbEye } from "react-icons/tb";
import { MdLockOutline } from "react-icons/md";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils/tw";

export type OperatorStatusBadgeProps = {
  isPrivate?: boolean;
};

type FCProps = FC<
  Omit<BadgeProps, keyof OperatorStatusBadgeProps> & OperatorStatusBadgeProps
>;

export const OperatorStatusBadge: FCProps = ({
  isPrivate,
  className,
  ...props
}) => {
  const Icon = isPrivate ? MdLockOutline : TbEye;
  return (
    <Badge
      variant={isPrivate ? "success" : "info"}
      className={cn(className, "rounded-md")}
      {...props}
    >
      <Icon className="size-[18px]" />
      {isPrivate ? "Private" : "Public"}
    </Badge>
  );
};

OperatorStatusBadge.displayName = "OperatorStatusBadge";
