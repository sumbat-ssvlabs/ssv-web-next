import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { WagmiProvider } from "wagmi";

import { RainbowKitProvider } from "@/lib/providers/rainbot-kit";
import { config } from "./wagmi/config";

import { DashboardLayout } from "@/components/layouts/DashboardLayout/DashboardLayout.tsx";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";

import "@/global.css";

import { Dashboard } from "@/app/routes/dashboard/dashboard";
import { Operator } from "@/app/routes/dashboard/operators/operator";
import { OperatorSettings } from "@/app/routes/dashboard/operators/operator-settings/operator-settings";
import { Operators } from "@/app/routes/dashboard/operators/operators";
import { Validators } from "@/app/routes/dashboard/validators/validators";
import { ProtectedRoute } from "@/components/protected-route";
import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";

import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "validators",
        element: <Validators />,
      },
      {
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
    path: "/join",
    element: <ConnectWallet />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <DashboardLayout>
            <RouterProvider router={router} />
          </DashboardLayout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
