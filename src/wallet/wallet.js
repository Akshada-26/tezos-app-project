exports.walletWrapper = (pKey) => {
    const getErrorOnPKey = (privateKey) => {
            if (typeof privateKey === "undefined") {
                return "privateKey is missing";
            }

            return null;
        },
        errorOnPKey = getErrorOnPKey(pKey);

    if (errorOnPKey !== null) {
        throw new Error(errorOnPKey);
    }

    return {

        "sign": () => {
            return null;
        },

        "balance": () => {
            return null;
        }
    };

};
