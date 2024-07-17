import { OperatorPickerFilter } from "@/components/operator/operator-picker-filter/operator-picker-filter";
import { OperatorPicker } from "@/components/operator/operator-picker/operator-picker";
import { cn } from "@/lib/utils/tw";
import { xor } from "lodash-es";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { createClusterFlow } from "../../../signals/create-cluster-signals";

export type SelectOperatorsProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectOperatorsProps> &
    SelectOperatorsProps
>;

export const SelectOperators: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className, "flex flex-col h-full")} {...props}>
      <OperatorPickerFilter />
      <OperatorPicker
        maxSelection={5}
        className="flex-1"
        selectedOperatorIds={createClusterFlow.selectedOperatorIds.value}
        onOperatorCheckedChange={(id) => {
          createClusterFlow.selectedOperatorIds.value = xor(
            createClusterFlow.selectedOperatorIds.value,
            [id],
          );
        }}
      />
    </div>
  );
};

SelectOperators.displayName = "SelectOperators";
