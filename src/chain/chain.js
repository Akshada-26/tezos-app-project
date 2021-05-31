exports.chainWrapper = (options) => {
    const getErrorOnAPI = (apiEndpoint) => {
            if (typeof apiEndpoint === "undefined") {
                return "apiEndpoint is missing";
            }

            return null;
        },
        getErrorOnContractAddress = (contractAdress) => {
            if (typeof contractAdress === "undefined") {
                return "Contract is missing";
            }

            return null;
        };

    const {apiEndpoint, contractAdress} = options,
        errorOnAPI = getErrorOnAPI(apiEndpoint),
        errorOnContractAddress = getErrorOnContractAddress(contractAdress);

    if (errorOnAPI !== null) {
        throw new Error(errorOnAPI);
    } else if (errorOnContractAddress !== null) {
        throw new Error(errorOnContractAddress);
    }

    return {
        "storage": null,
        "totalTokens": null,
        "totalInvestors": null,
        "totalInvesment": null,
        "companyValuation": null,
        "uscd": null,
        "CAFE": null,
        "user": {
            "invested": null,
            "deposited": null,
            "tokens": null,
            "uscd": null
        }
    };

};
