import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { Button } from "@/components/ui/button";
import { CopyBtn } from "@/components/ui/copy-btn";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useOperator } from "@/hooks/use-operator";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { cn } from "@/lib/utils/tw";
import path from "path";
import type { ComponentPropsWithoutRef, FC } from "react";
import { LuPackageSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

export type OperatorDetailsProps = {
  id?: number;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorDetailsProps> &
    OperatorDetailsProps
>;

export const OperatorDetails: FCProps = ({ id, className, ...props }) => {
  const operator = useOperator(id);
  const network = useSSVNetworkDetails();

  if (!operator.isSuccess) return null;
  return (
    <div className={cn(className, "flex items-center gap-3")} {...props}>
      <OperatorAvatar
        size="lg"
        src={operator.data.logo}
        isPrivate={operator.data.is_private}
      />
      <div className="flex flex-col h-full justify-between">
        <div className="flex gap-2 items-center">
          <Text variant="body-2-medium">{operator.data.name}</Text>
          <Tooltip content="Explore Operator">
            <Button
              as={Link}
              to={path.join(
                network.explorerUrl,
                "operators",
                operator.data.id_str,
              )}
              target="_blank"
              size="icon"
              variant="ghost"
              className="size-7"
            >
              <LuPackageSearch className="text-gray-500 size-5" />
            </Button>
          </Tooltip>
        </div>
        <div className="flex gap-2 items-center">
          <Text variant="body-3-medium" className="text-gray-500">
            ID: {operator.data.id}
          </Text>
          <CopyBtn text={operator.data.id_str} />
        </div>
      </div>
    </div>
  );
};

OperatorDetails.displayName = "OperatorDetails";
