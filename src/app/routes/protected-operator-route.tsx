import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useOperator } from "@/hooks/operator/use-operator";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import { Loading } from "@/components/ui/Loading";

export const ProtectedOperatorRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { address } = useAccount();
  const { operatorId } = useOperatorPageParams();
  const operator = useOperator(operatorId ?? "");

  if (isUndefined(operatorId)) return <Navigate to="../not-found" />;
  if (operator.isError || operator.data?.is_deleted)
    return <Navigate to="../not-found" />;
  if (
    operator.data &&
    !isAddressEqual(operator.data.owner_address as `0x${string}`, address!)
  )
    return <Navigate to="../not-your-operator" />;

  if (operator.isLoading) return <Loading />;

  return props.children;
};

ProtectedOperatorRoute.displayName = "ProtectedOperatorRoute";
