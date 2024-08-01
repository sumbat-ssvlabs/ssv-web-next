import { useOperator } from "@/hooks/use-operator";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate, useParams } from "react-router-dom";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";

export const ProtectedOperatorRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { operatorId } = useParams<{ operatorId: string }>();
  const operator = useOperator(operatorId ?? "");
  const { address } = useAccount();

  if (isUndefined(operatorId)) return <Navigate to="../not-found" replace />;
  if (operator.isError) return <Navigate to="../not-found" replace />;
  operator.data && console.log(operator.data);
  console.log(address);
  if (
    operator.data &&
    !isAddressEqual(operator.data.owner_address as `0x${string}`, address!)
  )
    return <Navigate to="../not-your-operator" replace />;

  return props.children;
};

ProtectedOperatorRoute.displayName = "ProtectedOperatorRoute";
