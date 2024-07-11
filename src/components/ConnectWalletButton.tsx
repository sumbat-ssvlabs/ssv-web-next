import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useRemoveOperator } from "@/lib/contract-interactions/write/useRemoveOperator";

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
  const removeOperator = useRemoveOperator({
    onConfirmed(hash) {
      console.log("confirmed", hash);
    },
    onConfirmationError(error) {
      console.log("error", error);
    },
    onMined(receipt) {
      console.log("mined", receipt);
    },
    onMiningError(error) {
      console.error("mining error", error);
    },
  });

  return (
    <>
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
                      data-cy="network-button"
                      size="network"
                      variant="secondary"
                      colorScheme="wallet"
                      onClick={openChainModal}
                      className="flex items-center gap-3"
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          className="size-6"
                          style={{
                            background: chain.iconBackground,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className="size-6"
                            />
                          )}
                        </div>
                      )}

                      <div className="flex gap-1 items-center">
                        <span> {chain.name}</span>{" "}
                        <ChevronDown className="size-5" />
                      </div>
                    </Button>
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
      <button
        onClick={() => {
          removeOperator.write({
            operatorId: 585n,
          });
        }}
      >
        remove operator ({removeOperator.isLoading ? "loading" : ""})
      </button>
    </>
  );
};
