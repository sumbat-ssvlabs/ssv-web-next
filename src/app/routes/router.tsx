import { DashboardLayout } from "@/app/layouts/dashboard/dashboard";
import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";
import { Funding } from "@/app/routes/create-cluster/funding";
import { GenerateKeySharesOffline } from "@/app/routes/create-cluster/generate-key-shares-offline";
import { GenerateKeySharesOnline } from "@/app/routes/create-cluster/generate-key-shares-online";
import { Preparation } from "@/app/routes/create-cluster/preparation";
import { SelectOperators } from "@/app/routes/create-cluster/select-operators";
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
import { WithdrawOperatorBalance } from "@/app/routes/dashboard/operators/withdraw-operator-balance";
import { FeeRecipientAddress } from "@/app/routes/dashboard/clusters/fee-recipient-address";
import { Join } from "@/app/routes/join/join";
import { JoinOperatorPreparation } from "@/app/routes/join/operator/join-operator-preparation";
import { RegisterOperator } from "@/app/routes/join/operator/register-operator";
import { RegisterOperatorConfirmation } from "@/app/routes/join/operator/register-operator-confirmation";
import { RegisterOperatorSuccess } from "@/app/routes/join/operator/register-operator-success";
import { SetOperatorFee } from "@/app/routes/join/operator/set-operator-fee";
import { ProtectedOperatorRoute } from "@/app/routes/protected-operator-route";
import { ProtectedRoute } from "@/app/routes/protected-route";
import { createBrowserRouter, Link, Outlet } from "react-router-dom";
import { Clusters } from "@/app/routes/dashboard/clusters/clusters";
import { Cluster } from "@/app/routes/dashboard/clusters/cluster/cluster";
import { WithdrawClusterBalance } from "@/app/routes/dashboard/clusters/cluster/withdraw-cluster-balance";
import { DepositClusterBalance } from "@/app/routes/dashboard/clusters/cluster/deposit-cluster-balance";
import { ProtectedClusterRoute } from "@/app/routes/protected-cluster-route";
import { RegisterOperatorGuard } from "@/guard/operator-guards";
import { DecreaseOperatorFee } from "@/app/routes/dashboard/operators/update-fee/decrease-operator-fee";
import { IncreaseOperatorFee } from "@/app/routes/dashboard/operators/update-fee/increase-operator-fee";
import { UpdateOperatorFee } from "@/app/routes/dashboard/operators/update-fee/update-operator-fee";
import { OperatorFeeUpdated } from "@/app/routes/dashboard/operators/update-fee/operator-fee-updated";
import { ProtectedOperatorUpdateFeeRoute } from "@/app/routes/dashboard/operators/update-fee/protected-operator-update-fee-route";

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter([
    {
      path: "/",
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
          element: <Preparation />,
        },
        {
          path: "create-cluster/select-operators",
          element: <SelectOperators />,
        },
        {
          path: "create-cluster/generate-online",
          element: <GenerateKeySharesOnline />,
        },
        {
          path: "create-cluster/generate-offline",
          element: <GenerateKeySharesOffline />,
        },
        {
          path: "create-cluster/funding",
          element: <Funding />,
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
  ]);
