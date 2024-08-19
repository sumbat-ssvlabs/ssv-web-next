import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import { Link } from "react-router-dom";
import path from "path";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { Tooltip } from "@/components/ui/tooltip";
import { MdOutlineTravelExplore } from "react-icons/md";
import { omit } from "lodash-es";

export type SsvExplorerBtnProps =
  | {
      operatorId: string | number;
    }
  | {
      validatorId: string;
    };

type FCProps = FC<
  Omit<ButtonProps, keyof SsvExplorerBtnProps> & SsvExplorerBtnProps
>;

export const SsvExplorerBtn: FCProps = ({ className, ...props }) => {
  const network = useSSVNetworkDetails();
  const isOperator = "operatorId" in props;

  const id = isOperator
    ? (props as { operatorId: string | number }).operatorId
    : (props as { validatorId: string }).validatorId;

  const clearedProps = omit(props, ["operatorId", "validatorId"]);

  return (
    <Tooltip
      asChild
      content={isOperator ? "Explore Operator" : "Explore Validator"}
    >
      <Button
        as={Link}
        to={path.join(
          network.explorerUrl,
          isOperator ? "operators" : "validators",
          id.toString(),
        )}
        onClick={(ev) => ev.stopPropagation()}
        target="_blank"
        size="icon"
        variant="subtle"
        className={cn("size-7 text-gray-700", className)}
        {...clearedProps}
      >
        <MdOutlineTravelExplore className="size-[65%]" />
      </Button>
    </Tooltip>
  );
};

SsvExplorerBtn.displayName = "SsvExplorerBtn";
