import type { SolidityCluster, Operator, Cluster } from "@/types/api";
import type { Address } from "abitype";
import { isNumber, merge } from "lodash-es";
import { encodePacked, keccak256 } from "viem";

export const getClusterHash = (
  account: Address,
  operators: (Pick<Operator, "id"> | number)[],
) =>
  keccak256(
    encodePacked(
      ["address", "uint256[]"],
      [
        account,
        operators.map((o) => {
          return BigInt(isNumber(o) ? o : o.id);
        }),
      ],
    ),
  );

export const getDefaultClusterData = (
  cluster: Partial<SolidityCluster> = {},
): SolidityCluster =>
  merge(
    {
      validatorCount: 0,
      networkFeeIndex: "0",
      index: "0",
      balance: "0",
      active: true,
    },
    cluster,
  );

export const formatClusterData = (
  cluster?: Partial<Cluster<{ operators: number[] }>> | null,
) => ({
  active: Boolean(cluster?.active),
  balance: BigInt(cluster?.balance ?? 0),
  index: BigInt(cluster?.index ?? 0),
  networkFeeIndex: BigInt(cluster?.networkFeeIndex ?? 0),
  validatorCount: cluster?.validatorCount ?? 0,
});
