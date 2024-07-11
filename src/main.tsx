import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { WagmiProvider } from "wagmi";

import { RainbowKitProvider } from "@/lib/providers/RainbowKit/index.tsx";
import { config } from "./wagmi/config";

import { ConnectWalletRoute } from "@/app/routes/ConnectWalletRoute/ConnectWalletRoute.tsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
import { DashboardLayout } from "@/components/layouts/DashboardLayout/DashboardLayout.tsx";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";

import "@/global.css";

import { DashboardRoute } from "@/app/routes/DashboardRoute/DashboardRoute";
import { ValidatorsRoute } from "@/app/routes/DashboardRoute/ValidatorsRoute";
import { OperatorsRoute } from "@/app/routes/DashboardRoute/OperatorsRoute";

import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardRoute />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "validators",
        element: <ValidatorsRoute />,
      },
      {
        path: "operators",
        element: <OperatorsRoute />,
      },
    ],
  },
  {
    path: "/join",
    element: <ConnectWalletRoute />,
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
