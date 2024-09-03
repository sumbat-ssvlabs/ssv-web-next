import type { FC, ComponentPropsWithoutRef } from "react";
import type { Pagination as IPagination, Cluster } from "@/types/api";
import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { Pagination } from "@/components/ui/pagination";
import { ClustersTableRow } from "@/components/validator/clusters-table/clusters-table-row";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type ClusterTableProps = {
  clusters: Cluster[];
  onClusterClick: (cluster: Cluster) => void;
  pagination: IPagination;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof ClusterTableProps> &
    ClusterTableProps
>;

export const ClusterTable: FCProps = ({
  clusters,
  onClusterClick,
  pagination,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-t-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead>
            <Tooltip
              asChild
              content={
                <>
                  Clusters represent a unique set of operators who operate your
                  validators.{" "}
                  <Button
                    as={Link}
                    to="https://docs.ssv.network/learn/stakers/clusters"
                    target="_blank"
                    variant="link"
                  >
                    Read more on clusters
                  </Button>
                </>
              }
            >
              <div className="flex gap-2 items-center">
                <Text>Cluster ID</Text>
                <FaCircleInfo className="size-3 text-gray-500" />
              </div>
            </Tooltip>
          </TableHead>
          <TableHead>Operators</TableHead>
          <TableHead>Validators</TableHead>
          <TableHead>Est Operational Runway</TableHead>
          <TableHead />
          <TableHead />
        </TableHeader>
        <TableBody>
          {clusters.map((cluster) => {
            return (
              <ClustersTableRow
                key={cluster.id}
                cluster={cluster}
                onClick={() => {
                  console.log(cluster);
                  return onClusterClick(cluster);
                }}
              />
            );
          })}
        </TableBody>
      </Table>
      {pagination.pages > 1 ? (
        <>
          <Divider />
          <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl">
            <Pagination pagination={pagination} />
          </div>
        </>
      ) : (
        <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl"></div>
      )}
    </div>
  );
};

ClusterTable.displayName = "ClusterTable";
