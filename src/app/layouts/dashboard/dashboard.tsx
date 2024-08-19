import { Navbar } from "@/app/layouts/dashboard/navbar";
import { SsvLogo } from "@/components/ui/ssv-logo";
import { TransactionModal } from "@/components/ui/transaction-modal";
import { useBlockNavigationOnPendingTx } from "@/hooks/use-block-navigation-on-pending-tx";
import { cn } from "@/lib/utils/tw";
import { useIsRestoring } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { ComponentPropsWithRef, FC } from "react";

export const DashboardLayout: FC<ComponentPropsWithRef<"div">> = ({
  children,
  className,
}) => {
  const isRestoring = useIsRestoring();
  useBlockNavigationOnPendingTx();

  return (
    <>
      <AnimatePresence>
        {isRestoring ? (
          <motion.div
            className={cn(
              "fixed bg-gray-50 inset-0 flex h-screen items-center justify-center",
            )}
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SsvLogo />
          </motion.div>
        ) : (
          <motion.div
            className={cn(
              "text-gray-800 flex flex-col h-screen max-h-screen overflow-hidden",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="content"
          >
            <Navbar />
            <main className={cn(className, "flex-1 overflow-auto")}>
              {children}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <TransactionModal />
    </>
  );
};

DashboardLayout.displayName = "Layout";
