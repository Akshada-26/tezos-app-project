const {expect, use} = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    {chainWrapper} = require("../../../src/chain/chain.js"),
    {configuration} = require("../../../config/configuration.js");

use(chaiAsPromised);

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const inlineLogger = async(log) => {
    // eslint-disable-next-line no-console
    console.log(await log);
};

describe("TzKTI Wrapper", function() {
    describe("Initialisation", function() {
        it("should complain about missing options", function() {
            expect(() => {
                return chainWrapper();
            }).to.throw(Error);
        });
    });

    describe("API request", function() {
        const config = configuration();

        it("should return storage", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.storage());
        });

        it("should return number of investors", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.totalInvestors());
        });

        it("should return the administrator", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.administrator());
        });

        it("should return total tokens", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.totalTokens());
        });

        it("should return total invesments", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.totalInvesments());
        });


        it("should return company valuation", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.companyValuation());
        });

        it("should return USCD/Tez price", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.uscd(getRandomInt(100)));
        });

        it("should return CAFE Parameters", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.uscd(getRandomInt(100)));
        });

        it("should return user TX history invested", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.user(getRandomInt(100)).invested());
        });

        it("should return user TX history deposited", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.user(getRandomInt(100)).deposited());
        });

        it("should return user tokens", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.user(getRandomInt(100)).tokens());
        });

        it("should return user USCD", async function() {
            const blockchain = chainWrapper(config);

            await inlineLogger(blockchain.user(getRandomInt(100)).uscd());
        });
    });
});
