import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { MevRelays } from "@/components/operator/operator-picker/operator-picker-item/mev-relays/mev-relays";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useGetValidatorsPerOperatorLimit } from "@/lib/contract-interactions/read/use-get-validators-per-operator-limit";
import { percentageFormatter } from "@/lib/utils/number";
import { getYearlyFee } from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";

export type OperatorPickerItemProps = {
  operator: Operator;
  isSelected?: boolean;
  isDisabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"label">, keyof OperatorPickerItemProps> &
    OperatorPickerItemProps
>;

export const OperatorPickerItem: FCProps = ({
  className,
  operator,
  onCheckedChange,
  isSelected,
  isDisabled,
  ...props
}) => {
  const { data: maxValidatorsPerOperator = 0 } =
    useGetValidatorsPerOperatorLimit();
  const reachedMaxValidators =
    operator.validators_count >= maxValidatorsPerOperator;
  const hasValidators = operator.validators_count !== 0;
  const isInactive = operator.is_active < 1;

  return (
    <Tooltip
      asChild
      content={
        reachedMaxValidators
          ? "Operator reached maximum amount of validators"
          : undefined
      }
    >
      <label
        htmlFor={operator.id.toString()}
        className={cn(
          "grid grid-cols-7 gap-2 text-sm p-4 rounded-sm font-medium items-center",
          {
            "opacity-50": isDisabled || reachedMaxValidators,
            "bg-primary-100": isSelected,
          },
          className,
        )}
        style={{
          gridTemplateColumns: "32px 1fr 1fr 1fr 1fr 1fr 1fr",
        }}
        {...props}
      >
        <Checkbox
          checked={isSelected}
          id={operator.id.toString()}
          onCheckedChange={
            isDisabled || reachedMaxValidators ? undefined : onCheckedChange
          }
        >
          Hello
        </Checkbox>
        <div className="flex items-center gap-2 overflow-hidden">
          <OperatorAvatar size="md" />
          <Text
            className="flex-1 text-ellipsis overflow-hidden"
            title={operator.name}
          >
            {operator.name}
          </Text>
        </div>
        <div>{operator.validators_count}</div>
        <div
          className={cn("flex flex-col gap-1 items-start", {
            "text-error-500": hasValidators && isInactive,
          })}
        >
          {percentageFormatter.format(operator.performance["30d"] / 100)}
          {isInactive && <Badge variant="error">Inactive</Badge>}
        </div>
        <div>{getYearlyFee(BigInt(operator.fee), { format: true })}</div>
        <MevRelays mevRelays={operator.mev_relays} />
        <SsvExplorerBtn operatorId={operator.id} />
      </label>
    </Tooltip>
  );
};

OperatorPickerItem.displayName = "OperatorPickerItem";
