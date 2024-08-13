import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedClusterRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { clusterHash } = useClusterPageParams();
  const cluster = useCluster(clusterHash ?? "");

  if (isUndefined(clusterHash)) return <Navigate to="../not-found" />;
  if (cluster.isError) return <Navigate to="../not-found" />;
  if (cluster.isLoading)
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-full  pb-6">
        <img src="/images/ssv-loader.svg" className="size-36" />
      </div>
    );

  return props.children;
};

ProtectedClusterRoute.displayName = "ProtectedOperatorRoute";
