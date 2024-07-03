import { WalletButton } from "@/components/ConnectWalletButton";
import "@/global.css";
import { useSSVNetworkDetails } from "@/lib/hooks/useSSVNetworkDetails";

function App() {
  const network = useSSVNetworkDetails();
  console.log("network:", network);

  return (
    <>
      <div>
        <WalletButton />
      </div>
    </>
  );
}

export default App;
