import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";

import { RainbowKitProvider } from "@/lib/providers/RainbowKit/index.tsx";
import { config } from "./wagmi/config";

import { Login } from "@/components/Login/Login.tsx";
import { DashboardLayout } from "@/components/layouts/DashboardLayout/DashboardLayout.tsx";
import { Buffer } from "buffer";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
globalThis.Buffer = Buffer;

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/join",
    element: <Login />,
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
