import { useOperator } from "@/hooks/operator/use-operator.ts";
import { useGetOperatorFee } from "@/lib/contract-interactions/read/use-get-operator-fee.ts";
import { getYearlyFee } from "@/lib/utils/operator.ts";
import type { OperatorID } from "@/types/types.ts";
import { formatSSV } from "@/lib/utils/number.ts";
import type { StatusBadgeVariantType } from "@/components/ui/badge.tsx";

export const useOperatorStats = (operatorId: OperatorID): {
  status: string,
  statusBadgeVariant: StatusBadgeVariantType,
  performance: string,
  yearlyFee: string
} | null => {
  const { data: operator, error } = useOperator(operatorId, { options: { retry: false } });
  const isRemovedOperator = error?.message.includes("404") || false;
  const { data: fee = 0n } = useGetOperatorFee(
    { operatorId: BigInt(operatorId) },
    { enabled: !!operator }
  );

  if (isRemovedOperator) {
    return {
      status: "Removed",
      statusBadgeVariant: "uncoloredError",
      performance: "-",
      yearlyFee: "-"
    };
  }

  if (!operator) {
    return null;
  }

  const operatorYearlyFee = formatSSV(getYearlyFee(fee));
  const statusBadgeVariant = operator.status === "Active" ? "success" : operator.status === "No Validators" ? "uncoloredError" : "error";
  return {
    status: operator.status,
    statusBadgeVariant,
    performance: `${operator.performance["30d"].toFixed(2)}%`,
    yearlyFee: `${operatorYearlyFee} SSV`
  };
};
