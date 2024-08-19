import { useTransactionModal } from "@/signals/modal";
import { useBlocker } from "react-router";

export const useBlockNavigationOnPendingTx = () => {
  const { isOpen } = useTransactionModal();
  useBlocker(isOpen);
};
