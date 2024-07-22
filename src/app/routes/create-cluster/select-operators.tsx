import { OperatorPickerFilter } from "@/components/operator/operator-picker-filter/operator-picker-filter";
import { OperatorPicker } from "@/components/operator/operator-picker/operator-picker";
import { cn } from "@/lib/utils/tw";
import { xor } from "lodash-es";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { createValidatorFlow } from "../../../signals/create-cluster-signals";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        maxSelection={4}
        className="flex-1"
        selectedOperatorIds={createValidatorFlow.selectedOperatorIds.value}
        onOperatorCheckedChange={(id) => {
          createValidatorFlow.selectedOperatorIds.value = xor(
            createValidatorFlow.selectedOperatorIds.value,
            [id],
          );
        }}
      />
      <Link to="/create-cluster/generate-online">
        <Button>Next</Button>
      </Link>
    </div>
  );
};

SelectOperators.displayName = "SelectOperators";
