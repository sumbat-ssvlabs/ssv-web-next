import { getOperatorNodes } from "@/api/operator";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export const useOperatorNodes = (layer: number) => {
  const chainId = useChainId();

  return useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ["operator-nodes", chainId, layer],
    queryFn: () => getOperatorNodes(layer),
  });
};
