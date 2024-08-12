import { createGuard } from "@/context/create-proxy-context";

export const [RegisterOperatorGuard, useRegisterOperatorState] = createGuard(
  {
    yearlyFee: 0n,
    publicKey: "",
    isPrivate: false,
  },
  "/join/operator",
);
