import { config } from "@/wagmi/config";

export const getChainName = (chainId: (typeof config.chains)[number]["id"]) => {
  return config.chains.find((chain) => chain.id === chainId)?.name;
};
