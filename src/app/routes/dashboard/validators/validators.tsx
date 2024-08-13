import type { FC, ComponentPropsWithoutRef } from "react";
import { DashboardPicker } from "@/components/dashboard/dashboard-picker";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Container } from "@/components/ui/container";
import { Link } from "react-router-dom";
import { Spacer } from "@/components/ui/spacer";
import { FiEdit3 } from "react-icons/fi";

export const Validators: FC<ComponentPropsWithoutRef<"div">> = () => {
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
          <Button size="lg" as={Link} to="/join/operator">
            Add Cluster
          </Button>
        </div>
      </Container>
    </>
  );
};

Validators.displayName = "Validators";
