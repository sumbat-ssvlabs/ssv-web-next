import { locationState } from "@/app/routes/router";
import { Loading } from "@/components/ui/Loading";
import { useIsNewAccount } from "@/hooks/account/use-is-new-account";
import { matchPath, Navigate } from "react-router";

export const Redirector = () => {
  const {
    isLoading,
    isNewAccount,
    clusters,
    operators,
    hasClusters,
    hasOperators,
  } = useIsNewAccount();

  const clusterMatch = matchPath(
    "/clusters/:id",
    locationState.previous.pathname,
  );
  const operatorMatch = matchPath(
    "/operators/:id",
    locationState.previous.pathname,
  );

  if (clusters.query.isLoading) return <Loading />;

  if (clusterMatch && clusters.query.isSuccess && hasClusters)
    return <Navigate to={clusterMatch?.pathname} replace />;

  if (operatorMatch && operators.query.isSuccess && hasOperators)
    return <Navigate to={operatorMatch?.pathname} replace />;

  if (clusters.query.isSuccess && hasClusters)
    return <Navigate to={"/clusters"} replace />;

  if (operators.query.isSuccess && hasOperators)
    return <Navigate to={"/operators"} replace />;

  if (isLoading) return <Loading />;
  if (isNewAccount) return <Navigate to="/join" replace />;

  return <Navigate to="/clusters" />;
};
