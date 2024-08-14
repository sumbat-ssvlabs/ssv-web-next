import { createGuard } from "@/guard/create-guard";

export const [RegisterOperatorGuard, useRegisterOperatorState] = createGuard(
  {
    yearlyFee: 0n,
    publicKey: "",
    isPrivate: false,
  },
  "/join/operator",
);

export const [UpdateOperatorFeeGuard, useUpdateOperatorFeeState] = createGuard(
  {},
  "/join/operator",
);
