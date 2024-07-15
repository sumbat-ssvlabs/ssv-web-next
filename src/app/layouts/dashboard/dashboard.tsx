import { Navbar } from "@/app/layouts/dashboard/navbar";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";

export const DashboardLayout: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn(className, "flex flex-col h-screen")} {...props}>
      <Navbar />
      <main className="p-6 flex-1 overflow-auto">{children}</main>
    </div>
  );
};

DashboardLayout.displayName = "Layout";
