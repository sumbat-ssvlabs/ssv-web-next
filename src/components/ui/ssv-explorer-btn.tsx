import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import { Link } from "react-router-dom";
import path from "path";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { LuPackageSearch } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";

export type SsvExplorerBtnProps = {
  operatorId: string | number;
};

type FCProps = FC<
  Omit<ButtonProps, keyof SsvExplorerBtnProps> & SsvExplorerBtnProps
>;

export const SsvExplorerBtn: FCProps = ({
  className,
  operatorId,
  ...props
}) => {
  const network = useSSVNetworkDetails();

  return (
    <Tooltip content="Explore Operator">
      <Button
        as={Link}
        to={path.join(network.explorerUrl, "operators", operatorId.toString())}
        onClick={(ev) => ev.stopPropagation()}
        target="_blank"
        size="icon"
        variant="ghost"
        className={cn("size-7 text-gray-500", className)}
        {...props}
      >
        <LuPackageSearch className="size-[65%]" />
      </Button>
    </Tooltip>
  );
};

SsvExplorerBtn.displayName = "SsvExplorerBtn";
