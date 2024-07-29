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

type FCProps = FC<ButtonProps>;

export const DashboardPicker: FCProps = ({ className, ...props }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn(className)} {...props} variant="ghost">
          Dashboard
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem defaultChecked>Validators</DropdownMenuItem>
        <DropdownMenuItem defaultChecked>Operators</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DashboardPicker.displayName = "DashboardPicker";
