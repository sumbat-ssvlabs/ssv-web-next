import { Navbar } from "@/components/layouts/DashboardLayout/Navbar";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";

export const DashboardLayout: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "flex flex-col min-h-full")} {...props}>
      <Navbar />
      <main className="p-6">{props.children}</main>
    </div>
  );
};

DashboardLayout.displayName = "Layout";
