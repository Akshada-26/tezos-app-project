const {walletWrapper} = require("./src/wallet/wallet.js"),
    {chainWrapper} = require("./src/chain/chain.js"),
    {contractWrapper} = require("./src/contract/contract.js"),
    {configuration} = require("./config/configuration.js");

const wallet = walletWrapper(configuration.privateKey),
    chain = chainWrapper(configuration.endpointAPI),
    contract = contractWrapper(wallet, configuration.contractAddress);

exports.chain = chain;
exports.contract = contract;

