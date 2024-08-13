import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";

export const Cluster: FC = () => {
  const { clusterHash } = useClusterPageParams();
  const cluster = useCluster(clusterHash!);
  return (
    <Container variant="vertical">
      <Card>
        <pre>{JSON.stringify(cluster.data, null, 2)}</pre>
      </Card>
    </Container>
  );
};

Cluster.displayName = "Cluster";
