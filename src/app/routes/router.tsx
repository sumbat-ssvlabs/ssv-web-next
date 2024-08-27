import { DashboardLayout } from "@/app/layouts/dashboard/dashboard";
import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";
import { AdditionalFunding } from "@/app/routes/create-cluster/additional-funding";
import { BalanceWarning } from "@/app/routes/create-cluster/balance-warning";
import { DistributeOffline } from "@/app/routes/create-cluster/distribute-offline";
import { DistributionMethod } from "@/app/routes/create-cluster/distribution-method";
import { GenerateKeySharesOnline } from "@/app/routes/create-cluster/generate-key-shares-online";
import { InitialFunding } from "@/app/routes/create-cluster/initial-funding";
import { Preparation } from "@/app/routes/create-cluster/preparation";
import { SelectOperators } from "@/app/routes/create-cluster/select-operators";
import { SlashingWarning } from "@/app/routes/create-cluster/slashing-warning";
import { UploadKeyshares } from "@/app/routes/create-cluster/upload-keyshares";
import { Cluster } from "@/app/routes/dashboard/clusters/cluster/cluster";
import { DepositClusterBalance } from "@/app/routes/dashboard/clusters/cluster/deposit-cluster-balance";
import { WithdrawClusterBalance } from "@/app/routes/dashboard/clusters/cluster/withdraw-cluster-balance";
import { Clusters } from "@/app/routes/dashboard/clusters/clusters";
import { FeeRecipientAddress } from "@/app/routes/dashboard/clusters/fee-recipient-address";
import { NoYourOperator } from "@/app/routes/dashboard/operators/no-your-operator";
import { Operator } from "@/app/routes/dashboard/operators/operator";
import { OperatorNotFound } from "@/app/routes/dashboard/operators/operator-not-found";
import { AuthorizedAddresses } from "@/app/routes/dashboard/operators/operator-settings/authorized-addresses";
import ExternalContract from "@/app/routes/dashboard/operators/operator-settings/external-contract";
import { OperatorMetadata } from "@/app/routes/dashboard/operators/operator-settings/operator-metadata";
import { OperatorSettings } from "@/app/routes/dashboard/operators/operator-settings/operator-settings";
import { OperatorStatus } from "@/app/routes/dashboard/operators/operator-settings/operator-status";
import { Operators } from "@/app/routes/dashboard/operators/operators";
import { RemoveOperator } from "@/app/routes/dashboard/operators/remove-operator";
import { DecreaseOperatorFee } from "@/app/routes/dashboard/operators/update-fee/decrease-operator-fee";
import { IncreaseOperatorFee } from "@/app/routes/dashboard/operators/update-fee/increase-operator-fee";
import { OperatorFeeUpdated } from "@/app/routes/dashboard/operators/update-fee/operator-fee-updated";
import { ProtectedOperatorUpdateFeeRoute } from "@/app/routes/dashboard/operators/update-fee/protected-operator-update-fee-route";
import { UpdateOperatorFee } from "@/app/routes/dashboard/operators/update-fee/update-operator-fee";
import { WithdrawOperatorBalance } from "@/app/routes/dashboard/operators/withdraw-operator-balance";
import { Join } from "@/app/routes/join/join";
import { JoinOperatorPreparation } from "@/app/routes/join/operator/join-operator-preparation";
import { RegisterOperator } from "@/app/routes/join/operator/register-operator";
import { RegisterOperatorConfirmation } from "@/app/routes/join/operator/register-operator-confirmation";
import { RegisterOperatorSuccess } from "@/app/routes/join/operator/register-operator-success";
import { SetOperatorFee } from "@/app/routes/join/operator/set-operator-fee";
import { ProtectedClusterRoute } from "@/app/routes/protected-cluster-route";
import { ProtectedOperatorRoute } from "@/app/routes/protected-operator-route";
import { ProtectedRoute } from "@/app/routes/protected-route";
import { RegisterOperatorGuard } from "@/guard/register-operator-guards";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Link, Outlet } from "react-router-dom";

const routes = [
  {
    path: "",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <div className="flex gap-2">
            <Link to="/clusters">Clusters</Link>
            <Link to="/operators">Operators</Link>
          </div>
        ),
      },
      {
        path: "join",
        element: <Join />,
      },
      {
        path: "join/operator",
        element: (
          <RegisterOperatorGuard>
            <Outlet />
          </RegisterOperatorGuard>
        ),
        children: [
          {
            index: true,
            element: <JoinOperatorPreparation />,
          },
          {
            path: "register",
            element: <RegisterOperator />,
          },
          {
            path: "fee",
            element: <SetOperatorFee />,
          },
          {
            path: "confirm-transaction",
            element: <RegisterOperatorConfirmation />,
          },
          {
            path: "success",
            element: <RegisterOperatorSuccess />,
          },
        ],
      },

      {
        path: "create-cluster",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Preparation />,
          },
          {
            path: "select-operators",
            element: <SelectOperators />,
          },

          {
            path: "generate-online",
            element: <GenerateKeySharesOnline />,
          },
          {
            path: "generate-offline",
            element: <UploadKeyshares />,
          },
          {
            path: "funding",
            element: <InitialFunding />,
          },
          {
            path: "balance-warning",
            element: <BalanceWarning />,
          },
          {
            path: "slashing-warning",
            element: <SlashingWarning />,
          },
        ],
      },

      {
        path: "clusters",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Clusters />,
          },
          {
            path: ":clusterHash",
            element: (
              <ProtectedClusterRoute>
                <Outlet />
              </ProtectedClusterRoute>
            ),
            children: [
              {
                index: true,
                element: <Cluster />,
              },
              {
                path: "add",
                element: <Outlet />,
                children: [
                  {
                    path: "distribution-method",
                    element: <DistributionMethod variant="add" />,
                  },
                  {
                    path: "online",
                    element: <GenerateKeySharesOnline />,
                  },
                  {
                    path: "offline",
                    element: <DistributeOffline />,
                  },
                  {
                    path: "keyshares",
                    element: <UploadKeyshares />,
                  },
                  {
                    path: "funding",
                    element: <AdditionalFunding />,
                  },
                ],
              },
              {
                path: "withdraw",
                element: <WithdrawClusterBalance />,
              },
              {
                path: "deposit",
                element: <DepositClusterBalance />,
              },
            ],
          },
        ],
      },
      {
        path: "fee-recipient",
        element: <FeeRecipientAddress />,
      },
      {
        path: "operators",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Operators />,
          },
          {
            path: ":operatorId",
            element: (
              <ProtectedOperatorRoute>
                <Outlet />
              </ProtectedOperatorRoute>
            ),
            children: [
              {
                index: true,
                element: <Operator />,
              },
              {
                path: "settings",
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <OperatorSettings />,
                  },
                  {
                    path: "authorized-addresses",
                    element: <AuthorizedAddresses />,
                  },
                  {
                    path: "status",
                    element: <OperatorStatus />,
                  },
                  {
                    path: "external-contract",
                    element: <ExternalContract />,
                  },
                ],
              },
              {
                path: "fee",
                element: (
                  <ProtectedOperatorUpdateFeeRoute>
                    <Outlet />
                  </ProtectedOperatorUpdateFeeRoute>
                ),
                children: [
                  {
                    path: "update",
                    element: <UpdateOperatorFee />,
                  },
                  {
                    path: "decrease",
                    element: <DecreaseOperatorFee />,
                  },
                  {
                    path: "increase",
                    element: <IncreaseOperatorFee />,
                  },
                  {
                    path: "success",
                    element: <OperatorFeeUpdated />,
                  },
                ],
              },

              {
                path: "withdraw",
                element: <WithdrawOperatorBalance />,
              },
              {
                path: "details",
                element: <OperatorMetadata />,
              },
              {
                path: "remove",
                element: <RemoveOperator />,
              },
            ],
          },
          {
            path: "not-found",
            element: <OperatorNotFound />,
          },
          {
            path: "not-your-operator",
            element: <NoYourOperator />,
          },
        ],
      },
    ],
  },
  {
    path: "/connect",
    element: (
      <DashboardLayout className="p-6">
        <ConnectWallet />
      </DashboardLayout>
    ),
  },
] as const satisfies RouteObject[];

type ExtractPaths<T extends RouteObject | RouteObject[]> =
  T extends RouteObject[]
    ? ExtractPaths<T[number]> // Recursively apply to each element in the array
    : T extends { path: infer P; children?: infer C }
      ?
          | P
          | (C extends RouteObject[]
              ? P extends string
                ? `${P}/${ExtractPaths<C> extends string ? ExtractPaths<C> : never}`
                : never
              : never)
      : never;

type ExtractParts<P> = P extends `${infer Start}:${string}/${infer Rest}`
  ? `${Start}${string}/${Rest}`
  : P extends `${infer Start}:${string}`
    ? `${Start}${string}/`
    : P;

type ExtractPaths2<T extends RouteObject | RouteObject[]> =
  T extends RouteObject[]
    ? ExtractPaths2<T[number]> // Recursively apply to each element in the array
    : T extends { path: infer P; children?: infer C }
      ? ExtractParts<
          | P
          | (C extends RouteObject[]
              ? P extends string
                ? `${P extends `:${string}` ? string : P}/${ExtractPaths<C> extends string ? ExtractPaths<C> : never}`
                : never
              : never)
        >
      : never;

export type RoutePaths = ExtractPaths<typeof routes>;
export type WritableRoutePaths = ExtractPaths2<typeof routes>;

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes);
