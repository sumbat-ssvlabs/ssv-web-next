import React from "react";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";

export interface SelectionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  title,
  description,
  selected = false,
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      aria-selected={selected}
      className={cn(
        "flex-1 p-5 rounded-xl flex flex-col justify-center items-center cursor-pointer",
        "border border-primary-500 text-primary-500",
        "aria-selected:text-white aria-selected:bg-primary-500",
        "transition-colors duration-200 ease-in-out",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <div className="mb-2">{icon}</div>
      <Text variant="body-2-medium">{title}</Text>
      <Text
        variant="caption-medium"
        className={cn("text-gray-500", {
          "text-white": selected,
        })}
      >
        {description}
      </Text>
    </div>
  );
};

SelectionCard.displayName = "SelectionCard";
