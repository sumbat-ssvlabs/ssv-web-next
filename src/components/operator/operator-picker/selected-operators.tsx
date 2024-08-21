import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import type { Operator } from "@/types/api";

export type SelectedOperatorsProps = {
  clusterSize: number;
  selectedOperators: Operator[];
  onRemoveOperator: (operator: Operator) => void;
};

type SelectedOperatorsFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectedOperatorsProps> &
    SelectedOperatorsProps
>;

export const SelectedOperators: SelectedOperatorsFC = ({
  className,
  onRemoveOperator,
  selectedOperators,
  clusterSize,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      <div className="flex justify-between items-center">
        <Text variant="headline4">Selected Operators</Text>
        <Text variant="headline4" className="text-primary-500">
          {selectedOperators.length}/{clusterSize}
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        {selectedOperators.map((operator) => (
          <div
            key={operator.public_key}
            className={cn(
              "flex items-center gap-2 p-4 rounded-sm bg-primary-100",
            )}
          >
            <Text>{operator.name}</Text>
            <button
              onClick={() => onRemoveOperator(operator)}
              className="text-primary-500"
            >
              Remove
            </button>
          </div>
        ))}
        {new Array(clusterSize - selectedOperators.length)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="p-8 rounded-sm bg-gray-200 border border-gray-500 border-dashed"
            />
          ))}
      </div>
    </div>
  );
};

SelectedOperators.displayName = "SelectedOperators";
