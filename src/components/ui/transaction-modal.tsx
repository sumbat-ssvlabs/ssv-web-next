import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useTransactionModal } from "@/signals/modal";
import type { ComponentPropsWithoutRef, FC } from "react";
import { LuCopy } from "react-icons/lu";

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
      <DialogContent className="flex flex-col gap-8 max-w-[424px] ">
        <div className="flex flex-col gap-3">
          <Text variant="headline4">Sending Transaction</Text>
          <Text variant="body-2-medium">
            Your transaction is pending on the blockchain - please wait while
            it's being confirmed
          </Text>
        </div>
        <img src="/images/ssv-loader.svg" className="size-28 mx-auto" />
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <Text variant="body-2-medium">Transaction Hash</Text>
            <div className="flex gap-3 px-5 py-3">
              <Text variant="body-2-medium" className="text-gray-500">
                {meta.hash}
              </Text>
              <LuCopy className="text-gray-500 size-3" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

TransactionModal.displayName = "TransactionModal";
