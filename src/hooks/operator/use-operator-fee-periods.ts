import { useOperator } from "@/hooks/operator/use-operator";
import { useGetOperatorDeclaredFee } from "@/lib/contract-interactions/read/use-get-operator-declared-fee";
import { useGetOperatorFeePeriods } from "@/lib/contract-interactions/read/use-get-operator-fee-periods";
import { formatDuration, intervalToDuration } from "date-fns";

export const humanizeDuration = (seconds: number) =>
  formatDuration(
    intervalToDuration({
      start: 0,
      end: seconds,
    }),
    {
      format: ["days", "hours", "minutes", "seconds"],
    },
  );
const defaultOperatorDeclaredFeeResponse = [false, 0n, 0n, 0n] as const;

export const useOperatorDeclaredFee = (operatorId: bigint) => {
  const { data = defaultOperatorDeclaredFeeResponse } =
    useGetOperatorDeclaredFee({ operatorId });
  console.log("data:", data);
  const [
    hasRequestedFeeChange,
    requestedFee,
    approvalBeginTime,
    approvalEndTime,
  ] = data;

  return {
    hasRequestedFeeChange,
    requestedFee,
    approvalBeginTime,
    approvalEndTime,
  };
};

type IncreaseFeeStatus =
  | "declaration"
  | "waiting"
  | "execution-pending"
  | "expired"
  | "approved";

export const useOperatorDeclaredFeeStatus = (
  operatorId: bigint,
): IncreaseFeeStatus => {
  const {
    hasRequestedFeeChange,
    requestedFee,
    approvalBeginTime,
    approvalEndTime,
  } = useOperatorDeclaredFee(operatorId);

  const operator = useOperator(String(operatorId));

  console.log("hasRequestedFeeChange:", hasRequestedFeeChange);
  if (!hasRequestedFeeChange) return "declaration";
  if (Date.now() / 1000 < approvalBeginTime) return "waiting";
  if (Date.now() / 1000 < approvalEndTime) return "execution-pending";
  if (BigInt(operator.data?.fee ?? 0) === requestedFee) return "approved";
  return "expired";
};

export const useOperatorFeeState = () => {
  const [declareOperatorFeePeriod, executeOperatorFeePeriod] =
    useGetOperatorFeePeriods().data?.map(Number) ?? [0, 0];

  return {
    declareOperatorFeePeriod,
    executeOperatorFeePeriod,
  };
};
