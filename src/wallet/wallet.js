exports.walletWrapper = (options) => {
    const getErrorOnOptions = (factoryOptions) => {
            if (typeof factoryOptions === "undefined") {
                return "Options is missing";
            } else if (typeof factoryOptions.SDK === "undefined") {
                return "Wallet SDK is missing";
            } else if (typeof factoryOptions.network === "undefined") {
                return "Network is missing";
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
            "name": options.name
        },
        wallet = new options.SDK(walletOptions),
        forcePermissionRequest = () => {
            return wallet
                .client
                .requestPermissions({
                    "network": {
                        "type": options.network
                    }
                })
                .then(() => {
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
            return wallet.getPKH();
        }

    };

};
