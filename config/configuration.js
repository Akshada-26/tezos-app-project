/* eslint-disable no-process-env */

// Require('dotenv').config();

exports.configuration = () => {
    return {
        "contractAddress": process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "KT1NVM3krSTHbkQSuCcGGqXzKSePFF3LKfED",
        "orgAccount": "tz1hRTppkUow3wQNcj9nZ9s5snwc6sGC8QHh",
        "chain": process.env.NEXT_PUBLIC_CHAIN || "florencenet",
        "apiEndpoint": process.env.NEXT_PUBLIC_INDEXER_API_ENDPOINT || "https://api.granadanet.tzkt.io/",
        "provider": process.env.NEXT_PUBLIC_NODE_PROVIDER || "https://granadanet.smartpy.io/"
    };
};
