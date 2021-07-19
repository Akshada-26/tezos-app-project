exports.contractWrapper = (options) => {

    const getErrorOnWallet = (wallet) => {
            if (typeof wallet === "undefined") {
                return "Wallet is missing";
            }

            return null;
        },
        getErrorOnContractAddress = (contractAddress) => {
            if (typeof contractAddress === "undefined") {
                return "Contract is missing";
            }

            return null;
        },
        getErrorOnSDK = (SDK) => {
            if (typeof SDK === "undefined") {
                return "SDK is missing";
            }

            return null;
        },
        getErrorProvider = (provider) => {
            if (typeof provider === "undefined") {
                return "provider is missing";
            }

            return null;
        };

    if (typeof options === "undefined") {
        throw new Error("Options is missing");
    }

    const {SDK, wallet, contractAddress, provider} = options,
        errorOnWallet = getErrorOnWallet(wallet),
        errorOnContract = getErrorOnContractAddress(contractAddress),
        errorOnSDK = getErrorOnSDK(SDK),
        errorOnProvider = getErrorProvider(provider);

    if (errorOnWallet !== null) {
        throw new Error(errorOnWallet);
    } else if (errorOnContract !== null) {
        throw new Error(errorOnContract);
    } else if (errorOnSDK !== null) {
        throw new Error(errorOnSDK);
    } else if (errorOnProvider !== null) {
        throw new Error(errorOnProvider);
    }

    const tezos = new SDK(provider);

    wallet.requestPermission().then((setting) => {
        tezos.setWalletProvider(setting);
    });

    const confirm = (call, numberBlocks) => {
            return call.then((op) => {
                return op.confirmation(numberBlocks).then(() => {
                    return op.opHash;
                });
            })
                .then((hash) => {
                    return `Operation injected: ${hash}`;
                })
                .catch((error) => {
                    return error.message;
                });
        },
        confirmDefault = (call) => {
            return confirm(call, 1);
        };

    return {

        "buy": (tezAmount) => {

            return confirmDefault(tezos.wallet.at(contractAddress)
                .then((contract) => {
                    return contract.methods.buy([["unit"]]).send({"amount": tezAmount});
                }));

        },
        "sell": (tokenAmount) => {
            return confirmDefault(tezos.wallet.at(contractAddress)
                .then((contract) => {
                    return contract.methods.sell(tokenAmount).send();
                }));
        },
        "burn": (tokenAmount) => {
            return confirmDefault(tezos.wallet.at(contractAddress)
                .then((contract) => {
                    return contract.methods.burn(tokenAmount).send();
                }));
        },
        "pay": (tezAmount) => {

            return confirmDefault(tezos.wallet.at(contractAddress)
                .then((contract) => {
                    return contract.methods.pay([["unit"]]).send({"amount": tezAmount});
                }));
        },
        "user": () => {
            return wallet.getPKH();
        }
    };
};
