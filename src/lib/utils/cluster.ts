import type { ClusterData, Operator } from "@/types/api";
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
  cluster: Partial<ClusterData> = {},
): ClusterData =>
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
