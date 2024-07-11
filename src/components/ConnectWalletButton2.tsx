import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown } from "lucide-react";
import { useAccount } from "wagmi";

type WalletType = "ledger" | "trezor" | "walletconnect" | "metamask";

const iconMap: Record<WalletType, string> = {
  ledger: "/images/wallets/ledger.svg",
  trezor: "/images/wallets/trezor.svg",
  walletconnect: "/images/wallets/walletconnect.svg",
  metamask: "/images/wallets/metamask.svg",
};

const getWalletIconSrc = (connectorName?: string) => {
  return (
    iconMap[connectorName?.toLowerCase() as WalletType] ||
    "/images/wallets/metamask.svg"
  );
};

export const WalletButton = () => {
  const { connector } = useAccount();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    data-cy="connect-btn"
                    size="lg"
                    width="full"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={openChainModal}
                  >
                    <div className="flex gap-1 items-center">
                      <span>Wrong Network</span>{" "}
                      <ChevronDown className="size-5" />
                    </div>
                  </Button>
                );
              }

              return (
                <div className="flex gap-3">
                  <Button
                    data-cy="wallet-button"
                    size="wallet"
                    className="gap-3"
                    variant="secondary"
                    colorScheme="wallet"
                    onClick={openAccountModal}
                  >
                    <img
                      className="size-6"
                      src={getWalletIconSrc(connector?.name)}
                      alt={`Connected to ${account.address}`}
                    />
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
