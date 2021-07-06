const {TezosToolkit} = require("@taquito/taquito"),
    {BeaconWallet} = require("@taquito/beacon-wallet");

const {walletWrapper} = require("./src/wallet/wallet.js"),
    {chainWrapper} = require("./src/chain/chain.js"),
    {contractWrapper} = require("./src/contract/contract.js"),
    {configuration} = require("./config/configuration.js");

const config = configuration();

const wallet = walletWrapper({
        "SDK": BeaconWallet,
        "network": config.chain,
        "name": "CSO App"
    }),
    chain = chainWrapper(config),
    contract = contractWrapper({
        "SDK": TezosToolkit,
        wallet,
        "contractAddress": config.contractAddress,
        "provider": config.provider
    });

exports.chain = chain;
exports.contract = contract;

