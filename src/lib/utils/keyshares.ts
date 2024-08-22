import { sortNumbers } from "@/lib/utils/number";
import { getOperatorIds } from "@/lib/utils/operator";
import type { Operator } from "@/types/api";
import type { KeySharesItem } from "ssv-keys";

export enum KeysharesValidationErrors {
  OPERATOR_NOT_EXIST_ID,
  OPERATOR_NOT_MATCHING_ID,
  VALIDATOR_EXIST_ID,
  ERROR_RESPONSE_ID,
  DuplicatedValidatorKeys,
  InconsistentOperatorPublicKeys,
  InconsistentOperators,
}

export class KeysharesError extends Error {
  constructor(public code: KeysharesValidationErrors) {
    super();
  }
}

export const isKeysharesError = (error: unknown): error is KeysharesError => {
  return error instanceof KeysharesError;
};

export const validateConsistentOperatorIds = (
  keyshares: KeySharesItem[],
  operatorIds: number[],
) => {
  return keyshares.every(({ payload, data }) => {
    const payloadOperatorIds = sortNumbers(payload.operatorIds).toString();

    const dataOperatorIds = sortNumbers(
      getOperatorIds(data.operators ?? []),
    ).toString();

    const valid =
      payloadOperatorIds === dataOperatorIds &&
      dataOperatorIds === sortNumbers(operatorIds).toString();

    if (!valid) {
      throw new KeysharesError(KeysharesValidationErrors.InconsistentOperators);
    }
    return valid;
  });
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
    throw new KeysharesError(
      KeysharesValidationErrors.InconsistentOperatorPublicKeys,
    );
  }

  return valid;
};

export const noDuplicatedValidatorKeys = (keyshares: KeySharesItem[]) => {
  console.time("noDuplicatedValidatorKeys");
  const set = new Set(keyshares.map(({ data }) => data.publicKey));
  if (set.size !== keyshares.length) {
    console.timeEnd("noDuplicatedValidatorKeys");
    throw new KeysharesError(KeysharesValidationErrors.DuplicatedValidatorKeys);
  }
  console.timeEnd("noDuplicatedValidatorKeys");
  return true;
};
