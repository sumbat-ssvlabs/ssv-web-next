import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { BiFilterAlt } from "react-icons/bi";

export type OperatorPickerFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorPickerFilterProps> &
    OperatorPickerFilterProps
>;

export const OperatorPickerFilter: FCProps = ({
  value,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "flex gap-2")} {...props}>
      <SearchInput value={value} onChange={(e) => onChange(e.target.value)} />
      <Button size="lg" variant="outline" className="pl-4">
        <BiFilterAlt className="mr-4" /> Filters
      </Button>
    </div>
  );
};

OperatorPickerFilter.displayName = "OperatorPickerFilter";
