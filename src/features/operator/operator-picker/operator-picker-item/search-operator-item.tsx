import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Checkbox } from "@/components/ui/checkbox";
import { Operator } from "@/types/api";
import { percentageFormatter } from "@/lib/utils/number";
import { getYearlyFee } from "@/lib/utils/operator";
import { MdOutlineQueryStats } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { OperatorAvatar } from "@/features/operator/operator-avatar";
import { MevRelays } from "@/features/operator/operator-picker/operator-picker-item/mev-relays/mev-relays";
import { Text } from "@/components/ui/text";

export type SearchOperatorItemProps = {
  operator: Operator;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"label">, keyof SearchOperatorItemProps> &
    SearchOperatorItemProps
>;

export const SearchOperatorItem: FCProps = ({
  className,
  operator,
  ...props
}) => {
  return (
    <label
      htmlFor={operator.id.toString()}
      className={cn(
        "grid grid-cols-7 gap-2 text-sm p-4 rounded-sm font-medium items-center",
        className,
      )}
      style={{
        gridTemplateColumns: "32px 1fr 1fr 1fr  1fr 1fr 1fr",
      }}
      {...props}
    >
      <Checkbox id={operator.id.toString()}>Hello</Checkbox>
      <div className="flex items-center gap-2 overflow-hidden">
        <OperatorAvatar size="md" />
        <Text className="flex-1 text-ellipsis overflow-hidden">
          {operator.name}
        </Text>
      </div>
      <div>{operator.validators_count}</div>
      <div>{percentageFormatter.format(operator.performance["30d"] / 100)}</div>
      <div>{getYearlyFee(BigInt(operator.fee), { format: true })}</div>
      <MevRelays mevRelays={operator.mev_relays} />
      <Button size="icon" variant="ghost">
        <MdOutlineQueryStats />
      </Button>
    </label>
  );
};

SearchOperatorItem.displayName = "SearchOperatorItem";
