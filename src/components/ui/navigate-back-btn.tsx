import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tw";
import type { FC } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

export const NavigateBackBtn: FC<ButtonProps> = ({ className, ...props }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      icon={<FaAngleLeft className="text-primary-500" />}
      className={cn(className, "font-bold")}
      {...props}
      onClick={(ev) => {
        props.onClick?.(ev);
        return navigate(-1);
      }}
    >
      {props.children ?? "Back"}
    </Button>
  );
};

NavigateBackBtn.displayName = "NavigateBackBtn";
