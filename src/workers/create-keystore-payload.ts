import { computeFundingCost } from "@/lib/utils/keystore";
import {
  prepareOperatorsForShares,
  sumOperatorsFee,
} from "@/lib/utils/operator";
import { ClusterData, Operator } from "@/types/api";
import { KeySharesItem } from "ssv-keys";
import { IOperator } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/IOperator";
import { Address } from "viem";

import { Buffer } from "buffer";
self.Buffer = Buffer;

const { SSVKeys } = await import("ssv-keys");
const ssvKeys = new SSVKeys();

const createShares = async (privateKey: string, operators: IOperator[]) => {
  const threshold = await ssvKeys.createThreshold(privateKey, operators);
  const encryptedShares = await ssvKeys.encryptShares(
    operators,
    threshold.shares,
  );
  return {
    threshold,
    encryptedShares,
  };
};

export type CreateKeystorePayloadMessage = MessageEvent<{
  account: Address;
  privateKey: string;
  ownerNonce: number;
  operators: Operator[];
  networkFee: bigint;
  liquidationCollateralPeriod: bigint;
  minimumLiquidationCollateral: bigint;
  depositAmount: bigint;
  fundingDays: number;
  clusterData: ClusterData;
}>;

export type KeystorePayloadResponseMessage = MessageEvent<
  | {
      error: Error;
      data: null;
    }
  | {
      error: null;
      data: [string, string, string, bigint, ClusterData];
    }
>;

self.onmessage = async function ({ data }: CreateKeystorePayloadMessage) {
  try {
    const operators = prepareOperatorsForShares(data.operators);
    const operatorsFee = sumOperatorsFee(data.operators);
    const totalCost = computeFundingCost({ ...data, operatorsFee });

    const { threshold, encryptedShares } = await createShares(
      data.privateKey,
      operators,
    );

    const shares = await new KeySharesItem().buildPayload(
      { publicKey: threshold.publicKey, operators, encryptedShares },
      {
        ownerAddress: data.account,
        ownerNonce: data.ownerNonce,
        privateKey: data.privateKey,
      },
    );

    self.postMessage({
      error: null,
      data: [
        data.privateKey,
        shares.operatorIds,
        shares.sharesData || shares.shares,
        totalCost,
        data.clusterData,
      ],
    });
  } catch (error) {
    self.postMessage({
      error,
      data: null,
    });
  }
};
