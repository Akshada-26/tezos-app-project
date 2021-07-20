import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { walletWrapper } from "./src/wallet/wallet.js";
import { chainWrapper } from "./src/chain/chain.js";
import { contractWrapper } from "./src/contract/contract.js";
import { configuration } from "./config/configuration.js";

const config = configuration();

const wallet = walletWrapper({
    SDK: BeaconWallet,
    network: config.chain,
    name: "PEQ App"
});

export const chain = chainWrapper(config);

export const contract = contractWrapper({
    SDK: TezosToolkit,
    wallet,
    contractAddress: config.contractAddress,
    provider: config.provider
});

