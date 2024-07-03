import { isAddress } from "viem";
import { useAccount, useChainId } from "wagmi";
import { z } from "zod";

const networkSchema = z.object({
  networkId: z.number(),
  api: z.string(),
  apiVersion: z.string(),
  apiNetwork: z.string(),
  explorerUrl: z.string(),
  insufficientBalanceUrl: z.string(),
  googleTagSecret: z.string().optional(),
  tokenAddress: z.string().refine(isAddress).optional(),
  setterContractAddress: z.string().refine(isAddress).optional(),
  getterContractAddress: z.string().refine(isAddress).optional(),
});

if (!import.meta.env.VITE_SSV_NETWORKS) {
  throw new Error(
    "VITE_SSV_NETWORKS is not defined in the environment variables",
  );
}

const parsed = import.meta.env.VITE_SSV_NETWORKS.map((network) =>
  networkSchema.safeParse(network),
);

const badSchema = parsed.find((network) => !network.success);

if (badSchema) {
  throw new Error(
    `
Invalid network schema in VITE_SSV_NETWORKS environment variable:
\t${badSchema.error?.errors
      .map((error) => `${error.path.join(".")} -> ${error.message}`)
      .join("\n\t")}
    `,
  );
}

export const useSSVNetworkDetails = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const network = import.meta.env.VITE_SSV_NETWORKS.find(
    (network) => network.networkId === (isConnected ? chainId : 17000),
  )!;

  return network;
};
