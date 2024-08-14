import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useOperator } from "@/hooks/operator/use-operator";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";

export const ProtectedOperatorRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { address } = useAccount();
  const { operatorId } = useOperatorPageParams();
  const operator = useOperator(operatorId ?? "");

  if (isUndefined(operatorId)) return <Navigate to="../not-found" />;
  if (operator.isError) return <Navigate to="../not-found" />;
  if (
    operator.data &&
    !isAddressEqual(operator.data.owner_address as `0x${string}`, address!)
  )
    return <Navigate to="../not-your-operator" />;

  if (operator.isLoading)
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-full  pb-6">
        <img src="/images/ssv-loader.svg" className="size-36" />
      </div>
    );

  return props.children;
};

ProtectedOperatorRoute.displayName = "ProtectedOperatorRoute";
