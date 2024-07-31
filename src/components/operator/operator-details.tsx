import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { useOperator } from "@/hooks/use-operator";
import { Text } from "@/components/ui/text";
import { LuCopy, LuPackageSearch } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import path from "path";
import { useCopyToClipboard } from "react-use";

export type OperatorDetailsProps = {
  id: number;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorDetailsProps> &
    OperatorDetailsProps
>;

export const OperatorDetails: FCProps = ({ id, className, ...props }) => {
  const operator = useOperator(id);
  const network = useSSVNetworkDetails();
  const [state, copy] = useCopyToClipboard();
  console.log("state:", state);
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
          <Button
            size="icon"
            variant="ghost"
            className="inline-flex size-6"
            onClick={() => copy(operator.data.id_str)}
          >
            <LuCopy className="text-gray-500 size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

OperatorDetails.displayName = "OperatorDetails";
