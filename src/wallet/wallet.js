exports.walletWrapper = (options) => {
    const getErrorOnOptions = (factoryOptions) => {
            if (typeof factoryOptions === "undefined") {
                return "Options is missing";
            } else if (typeof factoryOptions.SDK === "undefined") {
                return "Wallet SDK is missing";
            } else if (typeof factoryOptions.network === "undefined") {
                return "Network is missing";
            } else if (factoryOptions.network === "custom") {
                if (typeof factoryOptions.url === "undefined") {
                    return "RPC URL for custom network is missing";
                }
            } else if (typeof factoryOptions.name === "undefined") {
                return "Name is missing";
            }

            return null;
        },
        errorOnOptions = getErrorOnOptions(options);

    if (errorOnOptions !== null) {
        throw new Error(errorOnOptions);
    }

    const walletOptions = {
            "name": options.name,
            "disableDefaultEvents": true,
            "eventHandlers": {
                "OPERATION_REQUEST_SENT": {
                    "handler": (data) => {
                        console.log("reown quest success:", data);
                    }
                },
                "OPERATION_REQUEST_SUCCESS": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "OPERATION_REQUEST_ERROR": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "SIGN_REQUEST_SENT": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "SIGN_REQUEST_SUCCESS": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "SIGN_REQUEST_ERROR": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "ENCRYPT_REQUEST_SENT": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "ENCRYPT_REQUEST_SUCCESS": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "ENCRYPT_REQUEST_ERROR": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "BROADCAST_REQUEST_SENT": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "BROADCAST_REQUEST_SUCCESS": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "BROADCAST_REQUEST_ERROR": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },

                "ACKNOWLEDGE_RECEIVED": {
                    "handler": (data) => {
                        console.log("unkown quest success:", data);
                    }
                },

                "LOCAL_RATE_LIMIT_REACHED": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },

                "NO_PERMISSIONS": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },

                "ACTIVE_ACCOUNT_SET": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },

                "ACTIVE_TRANSPORT_SET": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },

                "SHOW_PREPARE": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "HIDE_UI": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },

                "PAIR_INIT": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "PAIR_SUCCESS": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "CHANNEL_CLOSED": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },

                "INTERNAL_ERROR": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                },
                "UNKNOWN": {
                    "handler": async(data) => {
                        console.log("unkown quest success:", data);
                    }
                }
            }
        },
        wallet = new options.SDK(walletOptions),
        forcePermissionRequest = () => {
            return wallet
                .client
                .requestPermissions({
                    "network": {
                        "type": options.network,
                        "rpcUrl": options.url
                    },
                    scopes: ["OPERATION_REQUEST", "SIGN"]
                })
                .then(() => {
                                // The data to format
const dappUrl = "tezos-test-d.app";
const ISO8601formatedTimestamp = new Date().toISOString();
const input = "Hello world!";

// The full string
const formattedInput = 
    [
        "Tezos Signed Message:",
        dappUrl,
        ISO8601formatedTimestamp,
        input
    ]
    .join(" ");
    
// The bytes to sign
const bytes = "05";

// The payload to send to the wallet
const payload = {
    signingType: "MICHELINE",
    payload: bytes,
    sourceAddress: userAddress
  };
  
// The signing
wallet.client.requestSignPayload(payload).then(signedPayload=>{console.log("asdasd" + signedPayload);});

                    return wallet;
                })
                .catch((error) => {
                    throw new Error(error);
                });
        };

    return {
        forcePermissionRequest,
        "requestPermission": () => {

            return wallet
                .client
                .checkPermissions({
                    "network": {
                        "type": options.network
                    }
                })
                .then(() => {
                    return wallet;
                })
                .catch(() => {
                    return forcePermissionRequest();
                });
        },
        "getPKH": () => {
            console.log(wallet);
            return wallet.getPKH();
        }

    };

};
