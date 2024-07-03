import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";

import { RainbowKitProvider } from "@/lib/providers/RainbowKit/index.tsx";
import { config } from "./wagmi/config";

import { Buffer } from "buffer";
import { Layout } from "@/components/Layout/Layout.tsx";
globalThis.Buffer = Buffer;

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Layout>
            <RouterProvider router={router} />
          </Layout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
