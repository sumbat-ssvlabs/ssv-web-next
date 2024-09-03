import { useOperator } from "@/hooks/operator/use-operator.ts";
import { useGetOperatorFee } from "@/lib/contract-interactions/read/use-get-operator-fee.ts";
import { getYearlyFee } from "@/lib/utils/operator.ts";
import type { OperatorID } from "@/types/types.ts";
import { formatSSV, percentageFormatter } from "@/lib/utils/number.ts";
import { useQuery } from "@tanstack/react-query";

export const useOperatorStats = (operatorId: OperatorID) => {
  const operator = useOperator(operatorId);
  const isRemoved = operator.error?.message.includes("404") || false;

  const operatorFee = useGetOperatorFee(
    { operatorId: BigInt(operatorId) },
    { enabled: !!operator },
  );

  const yearlyFee = formatSSV(getYearlyFee(operatorFee.data ?? 0n));

  const stats = useQuery({
    queryKey: ["operator-stats", operatorId, yearlyFee],
    queryFn: async () => {
      return {
        isRemoved,
        operator: {
          id: Number(operatorId),
          name: `Operator ${operatorId}`,
          status: "Removed",
          ...operator.data,
        } as const,
        yearlyFeeDisplay: isRemoved ? "-" : `${yearlyFee} SSV`,
        performance30dDisplay: isRemoved
          ? "-"
          : percentageFormatter.format(operator.data?.performance["30d"] ?? 0),
      };
    },
    enabled: isRemoved || (operator.isSuccess && operatorFee.isSuccess),
  });

  return stats;
};
