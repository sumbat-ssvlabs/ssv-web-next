import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { SsvLogo } from "@/components/SsvLogo";
import { Spacer } from "@/components/ui/Spacer";
import { WalletButton } from "@/components/ConnectWalletButton";

export type NavbarProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof NavbarProps> & NavbarProps
>;

export const Navbar: FCProps = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        className,
        "flex w-full items-center gap-10 h-20 bg-gray-50 px-6 py-5",
      )}
      {...props}
    >
      <SsvLogo className="h-full" />
      <p>My Account</p>
      <p>Explorer</p>
      <p>Docs</p>
      <Spacer />
      <WalletButton />
    </div>
  );
};

Navbar.displayName = "Navbar";
