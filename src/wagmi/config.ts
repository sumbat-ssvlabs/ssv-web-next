import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  walletConnectWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { HttpTransport, http } from "viem";
import { createConfig } from "wagmi";
import { holesky as holeskyBase, mainnet as mainnetBase } from "wagmi/chains";

const networks = [
  {
    networkId: 17000,
    api: "https://api.stage.ssv.network/api",
    apiVersion: "v4",
    apiNetwork: "holesky",
    explorerUrl: "https://holesky-explorer.stage.ssv.network",
    insufficientBalanceUrl: "https://faucet.stage.ssv.network",
    googleTagSecret: "GTM-K3GR7M5",
    tokenAddress: "0x68A8DDD7a59A900E0657e9f8bbE02B70c947f25F",
    setterContractAddress: "0x0d33801785340072C452b994496B19f196b7eE15",
    getterContractAddress: "0x656d5cC4e7d49EaCC063cBB8D3e072F2841D68b4",
  },
];

const mainnet: Chain = {
  ...mainnetBase,
  iconBackground: "none",
  iconUrl: "/images/networks/dark.svg",
};

const holesky: Chain = {
  ...holeskyBase,
  iconBackground: "none",
  iconUrl: "/images/networks/light.svg",
};

const isFaucet = import.meta.env.VITE_FAUCET_PAGE;
const isDistribution = import.meta.env.VITE_CLAIM_PAGE;

const app = isFaucet ? "faucet" : isDistribution ? "distribution" : "ssvweb";

const appChains: Record<typeof app, [Chain, ...Chain[]]> = {
  ssvweb: [mainnet, holesky],
  distribution: [mainnet, holesky],
  faucet: [holesky],
};

const supportedChainsMap: Record<number, Chain> = appChains[app].reduce(
  (acc, chain) => {
    acc[chain.id] = chain;
    return acc;
  },
  {} as Record<number, Chain>
);

const chains = networks
  .map((network) => supportedChainsMap[network.networkId])
  .filter(Boolean) as [Chain, ...Chain[]];

export const isChainSupported = (chainId: number) => {
  return chains.some((chain) => chain.id === chainId);
};

const transports = chains.reduce((acc, chain) => {
  acc[chain.id] = http();
  return acc;
}, {} as Record<string, HttpTransport>);

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [walletConnectWallet, coinbaseWallet],
    },
  ],
  {
    appName: "SSV Web App",
    projectId: "c93804911b583e5cacf856eee58655e6",
  }
);

export const config = createConfig({
  chains,
  connectors,
  transports,
});
