import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tw";
import type { FC } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export const NavigateBackBtn: FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      as={Link}
      variant="subtle"
      to=".."
      icon={<FaAngleLeft className="text-primary-500" />}
      className={cn(className, "font-bold w-fit")}
      {...props}
    >
      {props.children ?? "Back"}
    </Button>
  );
};

NavigateBackBtn.displayName = "NavigateBackBtn";
