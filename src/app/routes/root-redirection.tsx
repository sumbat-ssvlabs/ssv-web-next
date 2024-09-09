import { Loading } from "@/components/ui/Loading";
import { useIsNewAccount } from "@/hooks/account/use-is-new-account";
import { Navigate } from "react-router";

export const RootRedirection = () => {
  const { isLoading, isNewAccount, hasClusters, hasOperators } =
    useIsNewAccount();

  if (isLoading) return <Loading />;
  if (isNewAccount) return <Navigate to="/join" replace />;
  if (hasClusters) return <Navigate to="/clusters" replace />;
  if (hasOperators) return <Navigate to="/operators" replace />;

  return <Navigate to="/clusters" />;
};
