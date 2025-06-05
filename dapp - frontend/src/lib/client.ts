import { createPublicClient, createWalletClient, http, custom } from "viem";
import { sepolia } from "viem/chains";

// Declare ethereum property on Window interface
declare global {
  interface Window {
    ethereum: any;
  }
}

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export function getWalletClient() {
  if (typeof window !== "undefined" && window.ethereum) {
    return createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });
  }
  return null;
}
