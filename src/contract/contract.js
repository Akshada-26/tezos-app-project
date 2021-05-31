exports.contractWrapper = (options) => {

    const getErrorOnWallet = (wallet) => {
            if (typeof wallet === "undefined") {
                return "Wallet is missing";
            }

            return null;
        },
        getErrorOnContractAddress = (contractAdress) => {
            if (typeof contractAdress === "undefined") {
                return "Contract is missing";
            }

            return null;
        },
        getErrorOnOracle = (oracle) => {
            if (typeof oracle === "undefined") {
                return "Oracle is missing";
            }

            return null;
        };

    if (typeof options === "undefined") {
        throw new Error("Options is missing");
    }

    const {wallet, contractAdress, oracle} = options,
        errorOnWallet = getErrorOnWallet(wallet),
        errorOnContract = getErrorOnContractAddress(contractAdress),
        errorOnOracle = getErrorOnOracle(oracle);

    if (errorOnWallet !== null) {
        throw new Error(errorOnWallet);
    } else if (errorOnContract !== null) {
        throw new Error(errorOnContract);
    } else if (errorOnOracle !== null) {
        throw new Error(errorOnOracle);
    }

    return {
        "buy": null,
        "sell": null,
        "burn": null
    };
};
