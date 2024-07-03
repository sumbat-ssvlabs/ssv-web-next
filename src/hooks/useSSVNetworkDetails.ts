import { useAccount, useChainId } from "wagmi";

if (!import.meta.env.VITE_SSV_NETWORKS) {
  throw new Error(
    "VITE_SSV_NETWORKS is not defined in the environment variables",
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
