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
        "totalTokens": (storageData) => {
            const getTotalTokens = (data) => {
                return parseInt(data.total_tokens, 10);
            }

            if (storageData) return getTotalTokens(storageData);

            return storage().then(getTotalTokens);
        },
        "totalInvestments": (storageData) => {
            const getTotalInvestment = (data) => {
                return parseInt(data.total_investment, 10);
            }

            if (storageData) return getTotalInvestment(storageData);

            return storage().then(getTotalInvestment);
        },
        "mfg": (storageData) => {
            const getMFG = (data) => {
                return parseInt(data.MFG, 10);
            }

            if (storageData) return getMFG(storageData);

            return storage().then(getMFG);
        },
        "sellSlope": (storageData) => {
            const getSellSlope = (data) => {
                return parseInt(data.s, 10);
            }

            if (storageData) return getSellSlope(storageData);

            return storage().then(getSellSlope);
        },
        "buySlope": (storageData) => {
            const getBuySlope = (data) => {
                return parseInt(data.b, 10);
            }

            if (storageData) return getBuySlope(storageData);

            return storage().then(getBuySlope);
        },
        "i": (storageData) => {
            const getI = (data) => {
                return parseInt(data.I, 10);
            }

            if (storageData) return getI(storageData);

            return storage().then(getI);
        },
        "d": (storageData) => {
            const getD = (data) => {
                return parseInt(data.D, 10);
            }

            if (storageData) return getD(storageData);

            return storage().then(getD);
        },
        "unlockingDate": (storageData) => {
            const getMPT = (data) => {
                return data.MPT;
            }

            if (storageData) return getMPT(storageData);

            return storage().then(getMPT);
        },
        "burnedTokens": (storageData) => {
            const getBurnedTokens = (data) => {
                return parseInt(data.burned_tokens, 10);
            }

            if (storageData) return getBurnedTokens(storageData);

            return storage().then(getBurnedTokens);
        },
        "companyName": (storageData) => {
            const getCompanyName = (data) => {
                return data.company_name;
            }

            if (storageData) return getCompanyName(storageData);

            return storage().then(getCompanyName);
        },
        "companyValuation": (storageData) => {
            const getCompanyValuation = (data) => {
                return parseInt(data.company_v, 10);
            }

            if (storageData) return getCompanyValuation(storageData);

            return storage().then(getCompanyValuation);
        },
        "phase": (storageData) => {
            const getPhase = (data) => {
                return parseInt(data.phase, 10);
            }

            if (storageData) return getPhase(storageData);

            return storage().then(getPhase);
        },
        "buyPrice": (storageData) => {
            const getBuyPrice = (data) => {
                return parseInt(data.phase, 10) === 0
                    ? parseInt(data.price, 10)
                    : parseInt(data.b * data.total_tokens, 10);
            }

            if (storageData) return getBuyPrice(storageData);

            return storage().then(getBuyPrice);
        },
        "sellPrice": (storageData) => {
            const getSallPrice = (data) => {
                return parseInt(data.phase, 10) === 0
                    ? parseInt(data.price, 10)
                    : parseInt(data.s * data.total_tokens, 10);
            }

            if (storageData) return getSallPrice(storageData);

            return storage().then(getSallPrice);
        },
        "reserveAmount": () => {
            return balance(contractAddress).then((data) => {
                return data.length > 0
                    ? parseInt(data[data.length - 1].balance, 10)
                    : 0;
            });
        },
        "baseCurrency": (storageData) => {
            const getBaseCurrency = (data) => {
                return data.base_currency;
            }

            if (storageData) return getBaseCurrency(storageData);

            return storage().then(getBaseCurrency);
        },
        "totalAllocation": (storageData) => {
            const getTotalAllocation = (data) => {
                return parseInt(data.total_allocation, 10);
            }

            if (storageData) return getTotalAllocation(storageData);

            return storage().then(getTotalAllocation);
        },
        "stakeAllocation": (storageData) => {
            const getStakeAllocation = (data) => {
                return parseInt(data.stake_allocation, 10);
            }

            if (storageData) return getStakeAllocation(storageData);

            return storage().then(getStakeAllocation);
        },
        "initialReserve": () => {
            return balance(contractAddress).then((data) => {
                return parseInt(data[0].balance, 10);
            });
        },
        "terminationEvents": (storageData) => {
            const getTerminationEvents = (data) => {
                return data.termination_events;
            }

            if (storageData) return getTerminationEvents(storageData);

            return storage().then(getTerminationEvents);
        },
        "govRights": (storageData) => {
            const getGovRights = (data) => {
                return data.govRights;
            }

            if (storageData) return getGovRights(storageData);

            return storage().then(getGovRights);
        },
        "totalInvestors": (storageData) => {
            const getTotalInvestors = (data) => {
                return parseInt(Object.keys(data.ledger).length - 1, 10);
            }

            if (storageData) return getTotalInvestors(storageData);

            return storage().then(getTotalInvestors);
        },
        "minimumInvestment": (storageData) => {
            const getMinimumInvestment = (data) => {
                return parseInt(data.minimumInvestment, 10);
            }

            if (storageData) return getMinimumInvestment(storageData);

            return storage().then(getMinimumInvestment);
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
                            : parseInt(tokenAmount, 10);
                    });
                },
                "tez": () => {
                    return balance(address).then((data) => {
                        return data.length > 0
                            ? parseInt(data[data.length - 1].balance, 10)
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


                            return parseInt(bought - selled, 10);
                        });
                    });
                }
            };
        },
        "administrator": (storageData) => {
            const getAdministrator = (data) => {
                return data.organization;
            }

            if (storageData) return getAdministrator(storageData);

            return storage().then(getAdministrator);
        }
    };

};
