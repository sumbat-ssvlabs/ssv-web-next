import { sortNumbers } from "@/lib/utils/number";
import { getOperatorIds } from "@/lib/utils/operator";
import { keysharesSchema } from "@/lib/zod/keyshares";
import type { Operator } from "@/types/api";
import { KeyShares, type KeySharesItem } from "ssv-keys";

export enum KeysharesValidationErrors {
  OPERATOR_NOT_EXIST_ID,
  OPERATOR_NOT_MATCHING_ID,
  VALIDATOR_EXIST_ID,
  ERROR_RESPONSE_ID,
  DifferentCluster,
  DuplicatedValidatorKeys,
  InconsistentOperatorPublicKeys,
  InconsistentOperators,
}

export class KeysharesValidationError extends Error {
  constructor(public code: KeysharesValidationErrors) {
    super();
  }
}

export const isKeysharesError = (
  error: unknown,
): error is KeysharesValidationError => {
  return error instanceof KeysharesValidationError;
};

export const validateKeysharesSchema = async (
  file: File,
): Promise<KeySharesItem[]> => {
  const text = await file.text();
  const json = JSON.parse(text);
  keysharesSchema.parse(json);
  return (await KeyShares.fromJson(json)).list();
};

export const validateConsistentOperatorIds = (keyshares: KeySharesItem[]) => {
  const operatorIds = sortNumbers(keyshares[0].payload.operatorIds);

  keyshares.every(({ payload, data }) => {
    const payloadOperatorIds = sortNumbers(payload.operatorIds).toString();
    const dataOperatorIds = getOperatorIds(data.operators ?? []).toString();

    const valid =
      payloadOperatorIds === dataOperatorIds &&
      dataOperatorIds === operatorIds.toString();

    if (!valid) {
      throw new KeysharesValidationError(
        KeysharesValidationErrors.InconsistentOperators,
      );
    }
    return true;
  });

  return operatorIds;
};

export const validateConsistentOperatorPublicKeys = (
  keyshares: KeySharesItem[],
  operators: Pick<Operator, "id" | "public_key">[],
) => {
  const operatorsMap = new Map(operators.map((o) => [o.id, o.public_key]));
  const valid = keyshares.every(({ data }) =>
    data.operators?.every(
      ({ id, operatorKey }) => operatorsMap.get(id) === operatorKey,
    ),
  );

  if (!valid) {
    throw new KeysharesValidationError(
      KeysharesValidationErrors.InconsistentOperatorPublicKeys,
    );
  }

  return valid;
};

export const ensureValidatorsUniqueness = (keyshares: KeySharesItem[]) => {
  const set = new Set(keyshares.map(({ data }) => data.publicKey));
  if (set.size !== keyshares.length) {
    throw new KeysharesValidationError(
      KeysharesValidationErrors.DuplicatedValidatorKeys,
    );
  }
  return true;
};
