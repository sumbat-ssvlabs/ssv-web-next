import { cn } from "@/lib/utils/tw";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Helmet } from "react-helmet";

export const Operators: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "flex flex-col h-full")} {...props}>
      <Helmet>
        <title>SSV My Operators</title>
      </Helmet>
    </div>
  );
};

Operators.displayName = "Operators";
