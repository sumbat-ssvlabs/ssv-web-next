import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";
import { MainContainer } from "@/app/routes/dashboard/container";
import { Operator } from "@/app/routes/dashboard/operators/operator";
import { OperatorSettings } from "@/app/routes/dashboard/operators/operator-settings/operator-settings";
import { Operators } from "@/app/routes/dashboard/operators/operators";
import { Validators } from "@/app/routes/dashboard/validators/validators";
import { ProtectedRoute } from "@/app/routes/protected-route";
import { GenerateKeySharesOffline } from "@/app/routes/create-cluster/generate-key-shares-offline";
import { GenerateKeySharesOnline } from "@/app/routes/create-cluster/generate-key-shares-online";
import { Preparation } from "@/app/routes/create-cluster/preparation";
import { SelectOperators } from "@/app/routes/create-cluster/select-operators";
import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "@/app/layouts/dashboard/dashboard";
import { Funding } from "@/app/routes/create-cluster/funding";
import { OperatorDashboard } from "@/components/dashboard/operator-dashboard";
import { Join } from "@/app/routes/join/join";
import { CreateOperatorPreparation } from "@/app/routes/create-operator/create-operator";

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <MainContainer />
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "join",
          element: <Join />,
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
          index: true,
          path: "operators",
          element: <Operators />,
        },
        {
          path: "operator/:id",
          element: <Operator />,
        },
        {
          path: "operator/:id/settings",
          element: <OperatorSettings />,
        },
      ],
    },
    {
      path: "/connect",
      element: (
        <DashboardLayout>
          <ConnectWallet />
        </DashboardLayout>
      ),
    },
  ]);
