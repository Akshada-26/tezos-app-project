/* eslint-disable max-lines */

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

    const requestStorage = (level) => {
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
        requestStorageHistory = (limit) => {
            const limitRequest = typeof limit === "undefined"
                ? ""
                : `limit=${limit}`;

            return axios.get(`${apiEndpoint}v1/contracts/${contractAddress}/storage/history?${limitRequest}`)
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
        },
        cashedData = (cashedStorage, storageFunction, functionToCash) => {
            if (cashedStorage) {
                return functionToCash(cashedStorage);
            }

            return storageFunction().then(functionToCash);
        };

    return {
        "storage": requestStorage,
        "totalTokens": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.total_tokens, 10);
            });
        },
        "totalInvestments": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.total_investment, 10);
            });
        },
        "mfg": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.MFG, 10);
            });
        },
        "sellSlope": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.s, 10);
            });
        },
        "buySlope": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.b, 10);
            });
        },
        "i": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.I, 10);
            });
        },
        "d": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.D, 10);
            });
        },
        "unlockingDate": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return data.MPT;
            });
        },
        "burnedTokens": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.burned_tokens, 10);
            });
        },
        "companyName": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return data.company_name;
            });
        },
        "companyValuation": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.company_v, 10);
            });
        },
        "phase": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.phase, 10);
            });

        },
        "buyPrice": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.phase, 10) === 0
                    ? parseInt(data.price, 10)
                    : parseInt(data.b * data.total_tokens, 10);
            });
        },
        "baseCurrency": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return data.base_currency;
            });
        },
        "totalAllocation": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.total_allocation, 10);
            });
        },
        "stakeAllocation": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.stake_allocation, 10);
            });
        },
        "terminationEvents": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return data.termination_events;
            });

        },
        "govRights": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return data.govRights;
            });
        },
        "totalInvestors": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(Object.keys(data.ledger).length - 1, 10);
            });
        },
        "minimumInvestment": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return parseInt(data.minimumInvestment, 10);
            });

        },
        "administrator": (storageData) => {
            return cashedData(storageData, requestStorage, (data) => {
                return data.organization;
            });

        },
        "reserveAmount": () => {
            return balance(contractAddress).then((data) => {
                return data.length > 0
                    ? parseInt(data[data.length - 1].balance, 10)
                    : 0;
            });
        },
        "initialReserve": () => {
            return balance(contractAddress).then((data) => {
                return parseInt(data[0].balance, 10);
            });
        },
        "sellPrice": () => {
            return balance(contractAddress).then((data) => {
                return data.length > 0
                    ? parseInt(data[data.length - 1].balance, 10)
                    : 0;
            })
                .then((recentBalance) => {
                    return requestStorage().then((data) => {
                        if (parseInt(data.phase, 10) === 0) {
                            return data.price;
                        }
                        const factor = 1 / (2 * data.total_tokens),
                            subtract = 1 - factor;

                        if (data.total_tokens > 0) {
                            return parseInt(2 * recentBalance / data.total_tokens * subtract, 10);
                        }

                        return 0;
                    });
                });
        },
        "priceHistory": (start, end, steps) => {
            return requestStorageHistory(1000).then((data) => {
                let startDate = start,
                    endDate = end;

                if (typeof start === "undefined") {
                    startDate = new Date(0);
                }

                if (typeof end === "undefined") {
                    endDate = new Date();
                }

                const getClosePrice = (history, timeX) => {
                    const pricesBefore = history.filter((historicalStorage) => {
                            return historicalStorage.timestamp < timeX;
                        }),
                        [lastPrice] = pricesBefore.sort((firstTime, secondTime) => {
                            return firstTime.timestamp - secondTime.timestamp;
                        });

                    if (typeof lastPrice === "undefined") {
                        return 0;
                    }

                    return lastPrice.price;
                };

                const history = data
                        .filter((historicalStorage) => {
                            return historicalStorage.timestamp > startDate.toISOString() &&
                    historicalStorage.timestamp < endDate.toISOString();
                        })
                        .map((historicalStorage) => {
                            return {"timestamp": historicalStorage.timestamp,
                                "price": historicalStorage.value.price};
                        }),
                    intervallStep = (endDate - startDate) / steps,
                    points = [];

                if (history.length === 0) {
                    return [];
                }

                for (let index = 0; index <= steps; index += 1) {
                    const timeDelta = intervallStep * index,
                        timeX = new Date(Date.parse(startDate) + timeDelta).toISOString(),
                        priceY = getClosePrice(history, timeX);

                    points.push({"time": timeX,
                        "price": priceY});
                }

                return points;
            });
        },
        "user": (address) => {
            return {
                "bought": () => {
                    return transactions(address, "buy").then((data) => {
                        return Promise.all(data.map((transaction) => {
                            return requestStorage(transaction.level).then((currentState) => {
                                return requestStorage(transaction.level - 1).then((oldState) => {
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
                                return requestStorage(transaction.level).then((currentState) => {
                                    return requestStorage(transaction.level - 1).then((oldState) => {
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
                    return requestStorage().then((data) => {
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
        }
    };

};
