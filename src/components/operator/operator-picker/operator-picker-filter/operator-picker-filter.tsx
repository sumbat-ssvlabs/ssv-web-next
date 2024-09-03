import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Button } from "@/components/ui/button";
import { BiFilterAlt } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type OperatorPickerFilterProps = {
  onChange: (filters: {
    isVerifiedChecked: boolean;
    isDKGChecked: boolean;
  }) => void;
  isVerifiedChecked: boolean;
  isDKGChecked: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorPickerFilterProps> &
    OperatorPickerFilterProps
>;

export const OperatorPickerFilter: FCProps = ({
  onChange,
  isVerifiedChecked,
  isDKGChecked,
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "flex gap-2")} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" variant="outline" className="pl-4">
            <BiFilterAlt className="mr-4" /> Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={isVerifiedChecked}
            onCheckedChange={() =>
              onChange({
                isVerifiedChecked: !isVerifiedChecked,
                isDKGChecked,
              })
            }
          >
            <span>Verified</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isDKGChecked}
            onCheckedChange={() =>
              onChange({
                isVerifiedChecked,
                isDKGChecked: !isDKGChecked,
              })
            }
          >
            <span>DKG</span>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

OperatorPickerFilter.displayName = "OperatorPickerFilter";
