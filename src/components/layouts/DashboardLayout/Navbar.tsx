import { ConnectWalletBtn } from "@/components/ConnectWalletBtn";
import { NetworkSwitchBtn } from "@/components/NetworkSwitchBtn";
import { SsvLogo } from "@/components/SsvLogo";
import { Spacer } from "@/components/ui/spacer";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineExternalLink, HiOutlineGlobeAlt } from "react-icons/hi";
import { TbDots } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";

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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <TbDots className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Governance Forum <HiOutlineExternalLink className="text-gray-600" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Snapshot <HiOutlineExternalLink className="text-gray-600" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Terms of Use <HiOutlineExternalLink className="text-gray-600" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Privacy Policy <HiOutlineExternalLink className="text-gray-600" />
          </DropdownMenuItem>
          <div className="flex px-1 pb-1 text-gray-700">
            <Tooltip delayDuration={500} content="Discord">
              <DropdownMenuItem className="p-3 rounded-xl">
                <FaDiscord className="size-4" />
              </DropdownMenuItem>
            </Tooltip>
            <Tooltip delayDuration={500} content="X">
              <DropdownMenuItem className="p-3 rounded-xl">
                <FaXTwitter className="size-4" />
              </DropdownMenuItem>
            </Tooltip>
            <Tooltip delayDuration={500} content="ssv.network website">
              <DropdownMenuItem className="p-3 rounded-xl">
                <HiOutlineGlobeAlt className="size-4" />
              </DropdownMenuItem>
            </Tooltip>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Spacer />
      <div className="flex gap-2">
        <NetworkSwitchBtn />
        <ConnectWalletBtn />
      </div>
    </div>
  );
};

Navbar.displayName = "Navbar";
