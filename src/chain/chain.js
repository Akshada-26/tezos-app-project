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
        },
        transactions = (sender, entrypoint) => {
            const url = `${apiEndpoint}v1/operations/transactions?target=${contractAddress}`,
                senderFilter = typeof sender === "undefined"
                    ? ""
                    : `&sender=${sender}`,

                entryFilter = typeof entrypoint === "undefined"
                    ? ""
                    : `&entrypoint=${entrypoint}`;

            return axios.get(url + senderFilter + entryFilter)
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
                return data.total_tokens;
            });
        },
        "totalInvestors": () => {
            return storage().then((data) => {
                return Object.keys(data.ledger).length - 1;
            });
        },
        "totalInvestments": () => {
            return transactions().then((data) => {
                return data.reduce((all, next) => {
                    return all + next.amount;
                }, 0);
            });
        },
        "companyValuation": () => {
            return storage().then((data) => {
                return data.company_v;
            });
        },
        "buyPrice": () => {
            return storage().then((data) => {
                return data.buy_price;
            });
        },
        "sellPrice": () => {
            return storage().then((data) => {
                return data.sell_price;
            });
        },
        "CAFE": () => {
            return storage().then((data) => {
                return data.CAFE;
            });
        },
        "user": (address) => {
            return {
                "buyed": () => {
                    return transactions(address, "buy").then((data) => {
                        return data;
                    });
                },
                "selled": () => {
                    return transactions(address, "sell").then((data) => {
                        return data;
                    });
                },
                "tokens": () => {
                    return storage().then((data) => {
                        return data.ledger[address];
                    });
                },
                "tez": () => {
                    return null;
                },
                "invested": () => {
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
