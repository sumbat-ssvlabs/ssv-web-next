import { useOperator } from "@/hooks/use-operator";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate, useParams } from "react-router-dom";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";

export const ProtectedOperatorRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const params = useParams<{ id: string }>();
  const operator = useOperator(params.id ?? "");
  const { address } = useAccount();

  if (isUndefined(params.id)) return <Navigate to="/404" replace />;
  if (operator.isError) return <Navigate to="/404" replace />;
  if (
    operator.data &&
    !isAddressEqual(operator.data.owner_address as `0x${string}`, address!)
  )
    return <Navigate to="/not-your-operator" replace />;

  return props.children;
};

ProtectedOperatorRoute.displayName = "ProtectedOperatorRoute";
