import { Loading } from "@/components/ui/Loading";
import { useIsNewAccount } from "@/hooks/account/use-is-new-account";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate, useLocation, useMatch } from "react-router-dom";
import { useAccount } from "wagmi";

export const ProtectedRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const location = useLocation();
  const account = useAccount();
  const match = useMatch("/join*");

  const { isNewAccount, isLoading } = useIsNewAccount();

  if (!account.isConnected)
    return <Navigate to="/connect" state={location} replace />;

  if (isLoading) return <Loading />;
  if (isNewAccount && !match) return <Navigate to="/join" replace />;

  return props.children;
};

ProtectedRoute.displayName = "ProtectedRoute";
