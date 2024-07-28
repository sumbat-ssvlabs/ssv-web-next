import { OperatorPickerFilter } from "@/components/operator/operator-picker-filter/operator-picker-filter";
import { OperatorPicker } from "@/components/operator/operator-picker/operator-picker";
import { cn } from "@/lib/utils/tw";
import { xor } from "lodash-es";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { createValidatorFlow } from "../../../signals/create-cluster-signals";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export type SelectOperatorsProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectOperatorsProps> &
    SelectOperatorsProps
>;

export const SelectOperators: FCProps = ({ className, ...props }) => {
  return (
    <Container className="flex h-full items-stretch gap-4" size="xl">
      <Card
        className={cn(className, "flex flex-col flex-[2] h-full")}
        {...props}
      >
        <OperatorPickerFilter />
        <OperatorPicker
          maxSelection={4}
          selectedOperatorIds={createValidatorFlow.selectedOperatorIds.value}
          onOperatorCheckedChange={(id) => {
            createValidatorFlow.selectedOperatorIds.value = xor(
              createValidatorFlow.selectedOperatorIds.value,
              [id],
            );
          }}
        />
      </Card>
      <Card className="flex-[1]">
        Hello
        <Link to="/create-cluster/generate-online">
          <Button>Next</Button>
        </Link>
      </Card>
    </Container>
  );
};

SelectOperators.displayName = "SelectOperators";
