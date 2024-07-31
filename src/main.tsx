import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

import React from "react";
import ReactDOM from "react-dom/client";

import { RainbowKitProvider } from "@/lib/providers/rainbow-kit";
import { persister, queryClient } from "@/lib/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi/config";

import { router } from "@/app/routes";
import { RouterProvider } from "react-router-dom";

import "@/global.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import { TransactionModal } from "@/components/ui/transaction-modal";
import { Text } from "@/components/ui/text";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
        onSuccess={(...args) => {
          console.log("Query client persisted", args);
        }}
      >
        <RainbowKitProvider>
          <ReactQueryDevtools buttonPosition="bottom-right" />
          <RouterProvider router={router} />
          <TransactionModal />
          <Text
            variant="caption-medium"
            className="fixed bottom-0 left-0 m-2 text-gray-500 pointer-events-none"
          >
            {APP_VERSION}
          </Text>
        </RainbowKitProvider>
      </PersistQueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
