import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactionModal } from "@/signals/modal";
import type { ComponentPropsWithoutRef, FC } from "react";

export type TransactionModalProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof TransactionModalProps> &
    TransactionModalProps
>;

export const TransactionModal: FCProps = () => {
  const { meta, ...modal } = useTransactionModal();

  return (
    <Dialog {...modal}>
      <DialogContent>
        <DialogTitle>Transaction</DialogTitle>
        <DialogDescription>{meta.hash}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

TransactionModal.displayName = "TransactionModal";
