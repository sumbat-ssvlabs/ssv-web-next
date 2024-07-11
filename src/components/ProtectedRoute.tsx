import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

export const ProtectedRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const location = useLocation();
  const { isConnected } = useAccount();
  console.log("isConnected:", isConnected);
  if (!isConnected) {
    return <Navigate to="/join" state={location} replace />;
  }
  return props.children;
};

ProtectedRoute.displayName = "ProtectedRoute";
