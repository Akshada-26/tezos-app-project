const {expect, use} = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    {chainWrapper} = require("../../../src/chain/chain.js"),
    {configuration} = require("../../../config/configuration.js");

use(chaiAsPromised);

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
            const blockchain = chainWrapper(config),
                storage = await blockchain.storage();

            expect(storage).to.have.property("funds_ratio_for_reserve");
            expect(storage).to.have.property("revenues_ratio_for_reserve");
            expect(storage).to.have.property("buy_slope");
            expect(storage).to.have.property("sell_slope");
            expect(storage).to.have.property("MFG");
            expect(storage).to.have.property("MPT");
            expect(storage).to.have.property("phase");
            expect(storage).to.have.property("price");
            expect(storage).to.have.property("ledger");
            expect(storage).to.have.property("company_v");
            expect(storage).to.have.property("govRights");
            expect(storage).to.have.property("company_name");
            expect(storage).to.have.property("organization");
            expect(storage).to.have.property("total_tokens");
            expect(storage).to.have.property("base_currency");
            expect(storage).to.have.property("burned_tokens");
            expect(storage).to.have.property("stake_allocation");
            expect(storage).to.have.property("total_allocation");
            expect(storage).to.have.property("total_investment");
            expect(storage).to.have.property("minimumInvestment");
            expect(storage).to.have.property("termination_events");

        });

        it("should return number of investors", async function() {
            const blockchain = chainWrapper(config),
                totalInvestors = await blockchain.totalInvestors();

            expect(totalInvestors).to.be.a("number");
        });

        it("should return the administrator", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.administrator();

            expect(administrator).to.be.a("string");
        });

        it("should return the totalTokens", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.totalTokens();

            expect(administrator).to.be.a("number");
        });

        it("should return the totalInvestments", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.totalInvestments();

            expect(administrator).to.be.a("number");
        });

        it("should return the mfg", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.mfg();

            expect(administrator).to.be.a("number");
        });

        it("should return the sellSlope", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.sellSlope();

            expect(administrator).to.be.a("number");
        });

        it("should return the buySlope", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.buySlope();

            expect(administrator).to.be.a("number");
        });

        it("should return the i", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.i();

            expect(administrator).to.be.a("number");
        });

        it("should return the d", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.d();

            expect(administrator).to.be.a("number");
        });

        it("should return the unlockingDate", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.unlockingDate();

            expect(administrator).to.be.a("string");
        });

        it("should return the burnedTokens", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.burnedTokens();

            expect(administrator).to.be.a("number");
        });

        it("should return the companyName", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.companyName();

            expect(administrator).to.be.a("string");
        });

        it("should return the companyValuation", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.companyValuation();

            expect(administrator).to.be.a("number");
        });

        it("should return the phase", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.phase();

            expect(administrator).to.be.a("number");
        });

        it("should return the buyPrice", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.buyPrice();

            expect(administrator).to.be.a("number");
        });

        it("should return the sellPrice", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.buyPrice();

            expect(administrator).to.be.a("number");
        });
        it("should return the reserveAmount", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.reserveAmount();

            expect(administrator).to.be.a("number");
        });
        it("should return the baseCurrency", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.baseCurrency();

            expect(administrator).to.be.a("string");
        });

        it("should return the totalAllocation", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.totalAllocation();

            expect(administrator).to.be.a("number");
        });

        it("should return the stakeAllocation", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.stakeAllocation();

            expect(administrator).to.be.a("number");
        });

        it("should return the initialReserve", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.initialReserve();

            expect(administrator).to.be.a("number");
        });

        it("should return the terminationEvents", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.terminationEvents();

            expect(administrator).to.be.a("array");
        });

        it("should return the govRights", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.govRights();

            expect(administrator).to.be.a("string");
        });

        it("should return the totalInvestors", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.totalInvestors();

            expect(administrator).to.be.a("number");
        });

        it("should return the minimumInvestment", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.minimumInvestment();

            expect(administrator).to.be.a("number");
        });

        it("should return the minimumInvestment", async function() {
            const blockchain = chainWrapper(config),
                administrator = await blockchain.minimumInvestment();

            expect(administrator).to.be.a("number");
        });
    });
});
