import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";
import { MainContainer } from "@/app/routes/dashboard/container";
import { Operator } from "@/app/routes/dashboard/operators/operator";
import { OperatorSettings } from "@/app/routes/dashboard/operators/operator-settings/operator-settings";
import { Operators } from "@/app/routes/dashboard/operators/operators";
import { Validators } from "@/app/routes/dashboard/validators/validators";
import { ProtectedRoute } from "@/app/routes/protected-route";
import { createBrowserRouter } from "react-router-dom";

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainContainer />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "validators",
          element: <Validators />,
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
      element: <ConnectWallet />,
    },
  ]);
