import { Button } from "@/components/ui/button";
import { CopyBtn } from "@/components/ui/copy-btn";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useTransactionModal } from "@/signals/modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, FC } from "react";
import { LuSatelliteDish } from "react-icons/lu";
import { Link } from "react-router-dom";

export type TransactionModalProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof TransactionModalProps> &
    TransactionModalProps
>;

export const TransactionModal: FCProps = () => {
  const { meta, isOpen } = useTransactionModal();

  return (
    <Dialog isOpen={isOpen}>
      <DialogContent className="flex bg-gray-50 flex-col gap-8 max-w-[424px] font-medium ">
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
              Transaction Hash {meta.step}
            </Text>
            <div className="flex items-center h-[50px] px-5 pr-4 py-3 border rounded-xl">
              <Text
                variant="body-2-medium"
                className="flex-1 text-ellipsis overflow-hidden mr-3"
              >
                {meta.hash}
              </Text>
              <CopyBtn text={meta.hash} className="size-8" />
              <Button size="icon" variant="ghost" className="size-8">
                <LuSatelliteDish className="size-5" />
              </Button>
            </div>
          </div>
          <Button
            as={Link}
            target="_blank"
            variant="link"
            to="/transactions"
            className="w-full text-center"
          >
            View Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

TransactionModal.displayName = "TransactionModal";
