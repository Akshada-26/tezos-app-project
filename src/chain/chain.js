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

    const storage = (level) => {
            const levelRequest = typeof level === "undefined"
                ? ""
                : `?level=${level}`;


            return axios.get(`${apiEndpoint}v1/contracts/${contractAddress}/storage${levelRequest}`)
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
        balance = (address) => {
            return axios.get(`${apiEndpoint}v1/accounts/${address}/balance_history`)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    throw new Error(error);
                });
        },
        payedAmount = (hash) => {
            return axios.get(`${apiEndpoint}v1/operations/transactions/${hash}`)
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
        "totalInvestments": () => {
            return storage().then((data) => {
                return data.total_investment;
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
        "phase": () => {
            return storage().then((data) => {
                return data.phase;
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
            return balance(contractAddress).then((data) => {
                return data.length > 0
                    ? data[data.length - 1].balance
                    : 0;
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
            return balance(contractAddress).then((data) => {
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
                return Object.keys(data.ledger).length - 1;
            });
        },
        "minimumInvestment": () => {
            return storage().then((data) => {
                return data.minimumInvestment;
            });
        },
        "user": (address) => {
            return {
                "bought": () => {
                    return transactions(address, "buy").then((data) => {
                        return Promise.all(data.map((transaction) => {
                            return storage(transaction.level).then((currentState) => {
                                return storage(transaction.level - 1).then((oldState) => {
                                    const oldTokens = typeof oldState.ledger[address] === "undefined"
                                            ? 0
                                            : oldState.ledger[address],
                                        currentTokens = typeof currentState.ledger[address] === "undefined"
                                            ? 0
                                            : currentState.ledger[address];

                                    transaction.tokens = currentTokens - oldTokens;

                                    return transaction;
                                });
                            });
                        }));
                    });
                },
                "sold": () => {
                    return transactions(address, "sell").then((data) => {
                        return Promise.all(data.map((transaction) => {
                            return payedAmount(transaction.hash).then((batch) => {
                                return storage(transaction.level).then((currentState) => {
                                    return storage(transaction.level - 1).then((oldState) => {
                                        const oldTokens = typeof oldState.ledger[address] === "undefined"
                                                ? 0
                                                : oldState.ledger[address],
                                            currentTokens = typeof currentState.ledger[address] === "undefined"
                                                ? 0
                                                : currentState.ledger[address];

                                        transaction.tokens = oldTokens - currentTokens;
                                        const operation = batch.find((element) => {
                                            return element.sender.address === contractAddress;
                                        });

                                        transaction.amount = typeof operation === "undefined"
                                            ? 0
                                            : operation.amount;

                                        return transaction;
                                    });
                                });
                            });
                        }));
                    });
                },
                "tokens": () => {
                    return storage().then((data) => {
                        const tokenAmount = data.ledger[address];


                        return typeof tokenAmount === "undefined"
                            ? 0
                            : tokenAmount;
                    });
                },
                "tez": () => {
                    return balance(address).then((data) => {
                        return data.length > 0
                            ? data[data.length - 1].balance
                            : 0;
                    });
                },
                "tezInvested": () => {
                    return transactions(address, "buy").then((buyData) => {
                        return transactions(address, "sell").then((sellData) => {
                            const bought = buyData.reduce((all, next) => {
                                    return all + next.amount;
                                }, 0),
                                selled = sellData.reduce((all, next) => {
                                    return all + next.amount;
                                }, 0);


                            return bought - selled;
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
