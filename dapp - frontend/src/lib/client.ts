import { createPublicClient, createWalletClient, http, custom } from "viem";
import { anvil } from "viem/chains";

// Declare ethereum property on Window interface
declare global {
  interface Window {
    ethereum: any;
  }
}

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: anvil,
  transport: custom(window.ethereum),
});
