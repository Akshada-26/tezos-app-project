const axios = require("axios");

exports.chainWrapper = (options) => {
    const getErrorOnAPI = (apiEndpoint) => {
            if (typeof apiEndpoint === "undefined") {
                return "apiEndpoint is missing";
            }

            return null;
        },
        getErrorOnContractAddress = (contractAddress) => {
            if (typeof contractAddress === "undefined") {
                return "Contract is missing";
            }

            return null;
        };

    const {apiEndpoint, contractAddress} = options,
        errorOnAPI = getErrorOnAPI(apiEndpoint),
        errorOnContractAddress = getErrorOnContractAddress(contractAddress);

    if (errorOnAPI !== null) {
        throw new Error(errorOnAPI);
    } else if (errorOnContractAddress !== null) {
        throw new Error(errorOnContractAddress);
    }

    const storage = () => {
        return axios.get(`${apiEndpoint}v1/contracts/${contractAddress}/storage`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw new Error(error);
            });
    };

    return {
        storage,
        "totalTokens": () => {
            return storage().then((data) => {
                return data.total_supply;
            });
        },
        "totalInvestors": () => {
            return storage().then((data) => {
                return data.operators;
            });
        },
        "totalInvesments": () => {
            return null;
        },
        "companyValuation": () => {
            return null;
        },
        "uscd": () => {
            return null;
        },
        "CAFE": () => {
            return null;
        },
        "user": () => {
            return {
                "invested": () => {
                    return null;
                },
                "deposited": () => {
                    return null;
                },
                "tokens": () => {
                    return null;
                },
                "uscd": () => {
                    return null;
                }
            };
        },
        "administrator": () => {
            return storage().then((data) => {
                return data.administrator;
            });
        }
    };

};
