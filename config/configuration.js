exports.configuration = () => {
    return {
        "contractAddress": process.env.CONTRACT_ADDRESS || "KT1GHRd14xrbUDDGPR2G1PFwUSpEEwFPDnSX",
        "orgAccount": "tz1hRTppkUow3wQNcj9nZ9s5snwc6sGC8QHh",
        "chain": process.env.CHAIN || "florencenet",
        "apiEndpoint": process.env.INDEXER_API_ENDPOINT || "https://api.florencenet.tzkt.io/",
        "provider": process.env.NODE_PROVIDER || "https://florencenet.smartpy.io/"
    };
};
