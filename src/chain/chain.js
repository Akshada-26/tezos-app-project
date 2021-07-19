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

        },
        balance = () => {
            return axios.get(`${apiEndpoint}v1/accounts/${contractAddress}/balance_history`)
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
        "mfg": () => {
            return storage().then((data) => {
                return data.MFG;
            });
        },
        "sellSlope": () => {
            return storage().then((data) => {
                return data.s;
            });
        },
        "buySlope": () => {
            return storage().then((data) => {
                return data.b;
            });
        },
        "i": () => {
            return storage().then((data) => {
                return data.I;
            });
        },
        "d": () => {
            return storage().then((data) => {
                return data.D;
            });
        },
        "unlockingDate": () => {
            return storage().then((data) => {
                return data.MPT;
            });
        },
        "burnedTokens": () => {
            return storage().then((data) => {
                return data.burned_tokens;
            });
        },
        "companyName": () => {
            return storage().then((data) => {
                return data.company_name;
            });
        },
        "companyValuation": () => {
            return storage().then((data) => {
                return data.company_v;
            });
        },
        "buyPrice": () => {
            return storage().then((data) => {
                return parseInt(data.phase, 10) === 0
                    ? data.price
                    : data.b * data.total_tokens;
            });
        },
        "sellPrice": () => {
            return storage().then((data) => {
                return parseInt(data.phase, 10) === 0
                    ? data.price
                    : data.s * data.total_tokens;
            });
        },
        "reserveAmount": () => {
            return balance().then((data) => {
                return data[data.length - 1].balance;
            });
        },
        "baseCurrency": () => {
            return storage().then((data) => {
                return data.base_currency;
            });
        },
        "totalAllocation": () => {
            return storage().then((data) => {
                return data.total_allocation;
            });
        },
        "stakeAllocation": () => {
            return storage().then((data) => {
                return data.stake_allocation;
            });
        },
        "initialReserve": () => {
            return balance().then((data) => {
                return data[0].balance;
            });
        },
        "terminationEvents": () => {
            return storage().then((data) => {
                return data.termination_events;
            });
        },
        "govRights": () => {
            return storage().then((data) => {
                return data.govRights;
            });
        },
        "totalInvestors": () => {
            return storage().then((data) => {
                return Object.keys(data.ledger).length-1;
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
                "tezInvested": () => {
                    return transactions(address, "buy").then((buyData) => {
                        return transactions(address, "sell").then((sellData) => {
                            const buyed = buyData.reduce((all, next) => {
                                    return all + next.amount;
                                }, 0),
                                selled = sellData.reduce((all, next) => {
                                    return all + next.amount;
                                }, 0);


                            return buyed - selled;
                        });
                    });
                }
            };
        },
        "administrator": () => {
            return storage().then((data) => {
                return data.organization;
            });
        }
    };

};
