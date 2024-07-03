import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Navbar } from "@/components/Layout/Navbar";

export const Layout: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "flex flex-col")} {...props}>
      <Navbar />
      <main>{props.children}</main>
    </div>
  );
};

Layout.displayName = "Layout";
