import { SearchOperatorItem } from "@/features/operator/operator-picker/operator-picker-item/search-operator-item";
import { useSearchOperators } from "@/hooks/use-search-operators";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { VList } from "virtua";

export type OperatorPickerProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorPickerProps> &
    OperatorPickerProps
>;

export const OperatorPicker: FCProps = ({ className, ...props }) => {
  const infiniteQuery = useSearchOperators();

  return (
    <div className={cn(className)} {...props}>
      <VList
        style={{ height: "100%" }}
        onRangeChange={async (_, end) => {
          const page = infiniteQuery.data?.pages.at(-1);
          if (!page || infiniteQuery.isFetching) return;
          const last = page.pagination.page * page.pagination.per_page;
          if (end + page.pagination.per_page * 0.5 > last) {
            infiniteQuery.fetchNextPage();
          }
        }}
      >
        {infiniteQuery.data?.pages.map((page) =>
          page.operators.map((operator) => (
            <SearchOperatorItem
              key={operator.id}
              operator={operator}
              className="border-b border-gray-400"
            />
            // <Link to={`/operator/${operator.id}`}>
            //   <div className="h-14" key={operator.id}>
            //     {operator.id} - {operator.name}
            //   </div>
            // </Link>
          )),
        )}
        {infiniteQuery.isFetchingNextPage && <div>Loading...</div>}
        {!infiniteQuery.hasNextPage && <div>The end...</div>}
      </VList>
    </div>
  );
};

OperatorPicker.displayName = "OperatorPicker";
