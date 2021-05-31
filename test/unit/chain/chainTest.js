const {expect, use} = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    {chainWrapper} = require("../../../src/chain/chain.js");

use(chaiAsPromised);

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
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
        it("should return storage", function() {
            const blockchain = chainWrapper();

            blockchain.storage();
        });

        it("should return number of investors", function() {
            const blockchain = chainWrapper();

            blockchain.totalInvestors();
        });

        it("should return total tokens", function() {
            const blockchain = chainWrapper();

            blockchain.totalTokens();
        });

        it("should return total invesments", function() {
            const blockchain = chainWrapper();

            blockchain.totalInvesments();
        });


        it("should return company valuation", function() {
            const blockchain = chainWrapper();

            blockchain.companyValuation();
        });

        it("should return USCD/Tez price", function() {
            const blockchain = chainWrapper();

            blockchain.uscd(getRandomInt(100));
        });

        it("should return CAFE Parameters", function() {
            const blockchain = chainWrapper();

            blockchain.uscd(getRandomInt(100));
        });

        it("should return user TX history invested", function() {
            const blockchain = chainWrapper();

            blockchain.user(getRandomInt(100)).invested();
        });

        it("should return user TX history deposited", function() {
            const blockchain = chainWrapper();

            blockchain.user(getRandomInt(100)).deposited();
        });

        it("should return user tokens", function() {
            const blockchain = chainWrapper();

            blockchain.user(getRandomInt(100)).tokens();
        });

        it("should return user USCD", function() {
            const blockchain = chainWrapper();

            blockchain.user(getRandomInt(100)).uscd();
        });
    });
});
