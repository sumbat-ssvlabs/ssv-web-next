import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { CopyBtn } from "@/components/ui/copy-btn";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { FaPowerOff } from "react-icons/fa";

export type OperatorDetailsProps = {
  operator: Operator | Pick<Operator, "id" | "name"> & Partial<Pick<Operator, "logo" | "is_private" | "id_str">>;
  isRemovedOperator?: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorDetailsProps> &
  OperatorDetailsProps
>;

export const OperatorDetails: FCProps = ({ operator, isRemovedOperator, className, ...props }) => {
  return (
    <div className={cn(className, "flex items-center gap-3")} {...props}>
      <OperatorAvatar
        size="lg"
        src={operator.logo}
        isPrivate={operator.is_private}
      />
      <div className="flex flex-col h-full justify-between">
        <div className="flex gap-2 items-center">
          <Text variant="body-2-medium">{operator.name}</Text>
          {isRemovedOperator ?
            <div className="flex gap-2">
              <div className="size-5 rounded bg-error-100 flex items-center justify-center">
                <FaPowerOff className="size-3 text-error-500" />
              </div>
              <Tooltip
                asChild
                content="This operator has left the network permanently.">
                <FaCircleInfo className="text-gray-400 size-3.5" />
              </Tooltip>
            </div> : <SsvExplorerBtn operatorId={operator.id} />}
        </div>
        <div className="flex gap-2 items-center">
          <Text variant="body-3-medium" className="text-gray-500">
            ID: {operator.id}
          </Text>
          <CopyBtn text={operator.id_str} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};

OperatorDetails.displayName = "OperatorDetails";
