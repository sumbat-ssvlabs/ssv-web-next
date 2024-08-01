import { Button } from "@/components/ui/button";
import { CopyBtn } from "@/components/ui/copy-btn";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spacer } from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import { useTransactionModal } from "@/signals/modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Link } from "react-router-dom";

export type TransactionModalProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof TransactionModalProps> &
    TransactionModalProps
>;

export const TransactionModal: FCProps = () => {
  const { meta, open } = useTransactionModal();

  return (
    <Dialog open={open}>
      <DialogContent className="flex flex-col gap-8 max-w-[424px] font-medium ">
        <div className="flex flex-col gap-3">
          <DialogTitle>
            <Text variant="headline4">Sending Transaction</Text>
          </DialogTitle>
          <Text variant="body-2-medium">
            Your transaction is pending on the blockchain - please wait while
            it's being confirmed
          </Text>
        </div>
        <img src="/images/ssv-loader.svg" className="size-28 mx-auto" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Text variant="body-3-medium" className="text-gray-500">
              Transaction Hash
            </Text>
            <div className="flex items-center gap-3 h-[50px] px-5 py-3 border">
              <Text variant="body-2-medium" className="text-gray-500">
                {meta.hash}
              </Text>
              <Spacer />
              <CopyBtn text={meta.hash} className="size-8" />
              <Button size="icon" variant="ghost" className="size-8">
                <img src="/images/close-icon.svg" className="size-8" />
              </Button>
            </div>
          </div>
        </div>
        <Button as={Link} variant="link" to="/transactions">
          View Transaction
        </Button>
      </DialogContent>
    </Dialog>
  );
};

TransactionModal.displayName = "TransactionModal";
