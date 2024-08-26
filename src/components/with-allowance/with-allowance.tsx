import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useAccount, useReadContract } from "wagmi";
import { TokenABI } from "@/lib/abi/token";
import { useApprove } from "@/lib/contract-interactions/erc-20/write/use-approve";
import React, { useMemo } from "react";
import { Stepper } from "@/components/ui/stepper";
import { toast } from "@/components/ui/use-toast";
import { globals } from "@/config";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";

export type WithAllowanceProps = {
  size?: ButtonProps["size"];
  amount: bigint;
};

type WithAllowanceFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof WithAllowanceProps> &
    WithAllowanceProps
>;

export const WithAllowance: WithAllowanceFC = ({
  className,
  amount,
  size,
  ...props
}) => {
  const account = useAccount();
  const ssvNetworkDetails = useSSVNetworkDetails();

  const allowance = useReadContract({
    abi: TokenABI,
    address: ssvNetworkDetails?.tokenAddress,
    functionName: "allowance",
    args: [account.address!, ssvNetworkDetails?.setterContractAddress],
    query: {
      enabled: Boolean(account.address),
    },
  });

  const approver = useApprove();
  const approve = () => {
    if (!ssvNetworkDetails)
      return toast({
        variant: "destructive",
        title: "SSV Network Details not found",
      });

    approver.write(
      {
        spender: ssvNetworkDetails!.setterContractAddress,
        amount: globals.MAX_WEI_AMOUNT,
      },
      withTransactionModal(),
    );
  };

  const childrenWithProps = useMemo(
    () =>
      React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-expect-error - disabled prop
            disabled: !approver.isSuccess,
            size,
          });
        }
        return child;
      }),
    [approver.isSuccess, props.children, size],
  );

  if (allowance.isLoading) return props.children;
  if (allowance.isSuccess && allowance.data >= amount) return props.children;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className={cn("flex gap-4 [&>*]:flex-1")}>
        <Button
          size={size}
          onClick={approve}
          isLoading={approver.isPending}
          disabled={approver.isSuccess}
          isActionBtn
          loadingText="Approving..."
        >
          Approve SSV
        </Button>
        {childrenWithProps}
      </div>
      <Stepper
        className="w-[56%] mx-auto"
        steps={[
          {
            variant: !approver.isSuccess ? "active" : "done",
          },
          {
            variant: approver.isSuccess ? "active" : "default",
          },
        ]}
      />
    </div>
  );
};

WithAllowance.displayName = "WithAllowance";
