import type { FC, ComponentPropsWithoutRef } from "react";
import { DashboardPicker } from "@/components/dashboard/dashboard-picker";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Container } from "@/components/ui/container";
import { Link, useNavigate } from "react-router-dom";
import { Spacer } from "@/components/ui/spacer";
import { FiEdit3 } from "react-icons/fi";
import { ClusterTable } from "@/components/validator/clusters-table/clusters-table";
import { usePaginatedAccountClusters } from "@/hooks/cluster/use-paginated-account-clusters";

export const Clusters: FC<ComponentPropsWithoutRef<"div">> = () => {
  const { clusters, pagination } = usePaginatedAccountClusters();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>SSV My Clusters</title>
      </Helmet>

      <Container variant="vertical" size="xl" className="h-full py-6">
        <div className="flex justify-between w-full gap-3">
          <DashboardPicker />
          <Spacer />
          <Button size="lg" variant="secondary" as={Link} to="/fee-recipient">
            Fee Address <FiEdit3 />
          </Button>
          <Button size="lg" as={Link} to="/create-cluster">
            Add Cluster
          </Button>
        </div>
        <ClusterTable
          clusters={clusters}
          pagination={pagination}
          onClusterClick={(cluster) => navigate(cluster.clusterId)}
        />
      </Container>
    </>
  );
};

Clusters.displayName = "Clusters";
