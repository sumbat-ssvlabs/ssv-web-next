import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import path from "path";

export const endpoint = (...paths: (string | number)[]) => {
  const ssvNetwork = getSSVNetworkDetails();
  console.log("ssvNetwork.api:", ssvNetwork.api);
  const pt = path.join(
    ssvNetwork.api,
    ssvNetwork.apiVersion,
    ssvNetwork.apiNetwork,
    ...paths.map(String),
  );
  console.log("pt:", pt);
  return pt;
};
