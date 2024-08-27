import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

export const ProtectedRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const location = useLocation();
  const account = useAccount();
  console.log("account:", account);
  if (!account.isConnected)
    return <Navigate to="/connect" state={location} replace />;

  return props.children;
};

ProtectedRoute.displayName = "ProtectedRoute";
