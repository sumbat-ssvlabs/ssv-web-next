import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Outlet } from "react-router-dom";

export const Dashboard: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "max-w-screen-xl mx-auto")} {...props}>
      <Outlet />
    </div>
  );
};

Dashboard.displayName = "Dashboard";
