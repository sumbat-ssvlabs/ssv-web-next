import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/tw";
import type { FC } from "react";
import { useMatch } from "react-router";

type FCProps = FC<ButtonProps>;

export const DashboardPicker: FCProps = ({ className, ...props }) => {
  const isOperators = Boolean(useMatch("/operators"));
  const isValidators = Boolean(useMatch("/validators"));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn(className)} {...props} variant="ghost">
          {isOperators ? "Operators" : isValidators ? "Validators" : "All"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem defaultChecked={isValidators}>
          Validators
        </DropdownMenuItem>
        <DropdownMenuItem defaultChecked={isOperators}>
          Operators
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DashboardPicker.displayName = "DashboardPicker";
