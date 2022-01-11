/* eslint-disable no-process-env */

// Require('dotenv').config();

exports.configuration = () => {
    return {
        "contractAddress": process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "KT1RU9DAsYCd9uC1jwwiWvprZycjx3y1DmcZ",
        "orgAccount": "tz1QMVhWbyyoEamxyPm3D46dRbG3sNGoXqRQ",
        "chain": process.env.NEXT_PUBLIC_CHAIN || "hangzhounet",
        "apiEndpoint": process.env.NEXT_PUBLIC_INDEXER_API_ENDPOINT || "https://api.hangzhou2net.tzkt.io/",
        "provider": process.env.NEXT_PUBLIC_NODE_PROVIDER || "https://hangzhounet.smartpy.io/"
    };
};
