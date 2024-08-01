import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils/tw";
import { AnimatePresence, motion } from "framer-motion";
import type { FC } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

export type CopyBtnProps = {
  text: string | undefined;
};

type FCProps = FC<Omit<ButtonProps, keyof CopyBtnProps> & CopyBtnProps>;

export const CopyBtn: FCProps = ({ className, text, ...props }) => {
  const { copy, hasCopied } = useClipboard();
  return (
    <Button
      disabled={!text}
      size="icon"
      variant="ghost"
      className={cn("relative inline-flex size-6  overflow-hidden", className)}
      {...props}
      onClick={() => copy(text ?? "")}
    >
      <AnimatePresence>
        {!hasCopied ? (
          <motion.div
            key="copy"
            className="size-[55%]"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              translate: "-50%, -50%",
            }}
            transition={{ duration: 0.2, type: "spring" }}
            initial={{ opacity: 0, rotate: -180, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, rotate: 0, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, rotate: 180, x: "-50%", y: "-50%" }}
          >
            <LuCopy className="text-gray-500 size-full" strokeWidth="2.5" />
          </motion.div>
        ) : (
          <motion.div
            key="copied"
            className="size-[55%]"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
            transition={{ duration: 0.2, type: "spring" }}
            initial={{ opacity: 0, rotate: -180, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, rotate: 0, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, rotate: 180, x: "-50%", y: "-50%" }}
          >
            <LuCheck className="text-success-500 size-full" strokeWidth="2.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

CopyBtn.displayName = "CopyBtn";
