import { usePaginatedAccountClusters } from "@/hooks/cluster/use-paginated-account-clusters";
import { usePaginatedAccountOperators } from "@/hooks/operator/use-paginated-account-operators";

export const useIsNewAccount = () => {
  const clusters = usePaginatedAccountClusters();
  const operators = usePaginatedAccountOperators();

  const hasClusters = clusters.clusters.length > 0;
  const hasOperators = operators.operators.length > 0;

  const isLoading = clusters.query.isLoading || operators.query.isLoading;

  const isNewAccount = isLoading ? undefined : !hasClusters && !hasOperators;
  const accountRoutePath = isLoading
    ? undefined
    : isNewAccount
      ? "/join"
      : hasClusters
        ? "/clusters"
        : "/operators";

  return {
    isLoading,
    isNewAccount,
    hasClusters,
    hasOperators,
    accountRoutePath,
  };
};
