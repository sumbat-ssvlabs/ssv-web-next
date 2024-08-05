import { DashboardLayout } from "@/app/layouts/dashboard/dashboard";
import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";
import { Funding } from "@/app/routes/create-cluster/funding";
import { GenerateKeySharesOffline } from "@/app/routes/create-cluster/generate-key-shares-offline";
import { GenerateKeySharesOnline } from "@/app/routes/create-cluster/generate-key-shares-online";
import { Preparation } from "@/app/routes/create-cluster/preparation";
import { SelectOperators } from "@/app/routes/create-cluster/select-operators";
import { CreateOperatorPreparation } from "@/app/routes/create-operator/create-operator";
import { NoYourOperator } from "@/app/routes/dashboard/operators/no-your-operator";
import { Operator } from "@/app/routes/dashboard/operators/operator";
import { OperatorNotFound } from "@/app/routes/dashboard/operators/operator-not-found";
import { AuthorizedAddresses } from "@/app/routes/dashboard/operators/operator-settings/authorized-addresses";
import ExternalContract from "@/app/routes/dashboard/operators/operator-settings/external-contract";
import { OperatorMetadata } from "@/app/routes/dashboard/operators/operator-settings/opeator-metadata";
import { OperatorSettings } from "@/app/routes/dashboard/operators/operator-settings/operator-settings";
import { OperatorStatus } from "@/app/routes/dashboard/operators/operator-settings/operator-status";
import { Operators } from "@/app/routes/dashboard/operators/operators";
import { WithdrawOperatorBalance } from "@/app/routes/dashboard/operators/withdraw-operator-balance";
import { Validators } from "@/app/routes/dashboard/validators/validators";
import { Join } from "@/app/routes/join/join";
import { ProtectedOperatorRoute } from "@/app/routes/protected-operator-route";
import { ProtectedRoute } from "@/app/routes/protected-route";
import { OperatorDashboard } from "@/components/dashboard/operator-dashboard";
import { createBrowserRouter, Outlet } from "react-router-dom";

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
          path: "join",
          element: [<Join />, <Join />],
        },
        {
          path: "join/operator",
          element: <CreateOperatorPreparation />,
        },
        {
          path: "my-account/operator-dashboard",
          element: <OperatorDashboard />,
        },

        {
          path: "validators",
          element: <Validators />,
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
                  path: "withdraw",
                  element: <WithdrawOperatorBalance />,
                },
                {
                  path: "details",
                  element: <OperatorMetadata />,
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
