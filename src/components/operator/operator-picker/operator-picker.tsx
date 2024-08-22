import { OperatorPickerItem } from "@/components/operator/operator-picker/operator-picker-item/operator-picker-item";
import type { useSearchOperators } from "@/hooks/use-search-operators";
import type { FC } from "react";
import type { VListProps } from "virtua";
import { VList } from "virtua";

export type OperatorPickerProps = {
  selectedOperatorIds: readonly number[];
  onOperatorCheckedChange: (operatorId: number, checked: boolean) => void;
  maxSelection?: number;
  query: ReturnType<typeof useSearchOperators>;
};

type FCProps = FC<Omit<VListProps, "children"> & OperatorPickerProps>;

export const OperatorPicker: FCProps = ({
  selectedOperatorIds,
  onOperatorCheckedChange,
  maxSelection,
  query,
  ...props
}) => {
  const isMaxSelected = selectedOperatorIds.length === maxSelection;

  return (
    <VList
      className="flex-1"
      {...props}
      onRangeChange={async (_, end) => {
        const page = query.data?.pages.at(-1);
        if (!page || query.isFetching) return;
        const last = page.pagination.page * page.pagination.per_page;
        if (end + page.pagination.per_page * 0.5 > last) {
          query.fetchNextPage();
        }
      }}
    >
      {query.data?.pages.map((page) =>
        page.operators.map((operator) => {
          const isSelected = selectedOperatorIds.includes(operator.id);
          return (
            <OperatorPickerItem
              key={operator.id}
              isSelected={isSelected}
              isDisabled={isMaxSelected && !isSelected}
              operator={operator}
              onCheckedChange={(checked) =>
                onOperatorCheckedChange(operator.id, checked)
              }
            />
          );
        }),
      )}
      {query.isFetchingNextPage && <div>Loading...</div>}
      {!query.hasNextPage && !query.isSuccess && <div>The end...</div>}
    </VList>
  );
};

OperatorPicker.displayName = "OperatorPicker";
