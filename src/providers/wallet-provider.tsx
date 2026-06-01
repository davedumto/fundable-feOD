"use client";
import React, { useMemo } from "react";

import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";

// Cartridge Controller connector is configured once at module scope so that
// the same instance is reused across re-renders. It is added alongside the
// injected wallets discovered by `useInjectedConnectors`, so users see every
// Starknet wallet they have installed in addition to Cartridge.
const cartridgeConnector = new ControllerConnector({
  chains: [
    { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
    { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
  ],
  defaultChainId: "0x534e5f5345504f4c4941", // SN_SEPOLIA
});

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  // Auto-discover injected Starknet wallets (Argent X, Braavos, and any
  // other browser-installed wallet that follows the get-starknet standard).
  // `argent()` and `braavos()` are listed as recommended so they surface
  // first even when the user has not yet installed them.
  const { connectors: injectedConnectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "always",
    order: "alphabetical",
  });

  const connectors = useMemo(
    // Cartridge is appended last so it always appears in the picker even if
    // no injected wallets are present.
    () => [...injectedConnectors, cartridgeConnector],
    [injectedConnectors]
  );

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
};

export default WalletProvider;
