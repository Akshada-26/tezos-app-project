const {expect, use, assert} = require("chai"),
    sinon = require("sinon"),
    chaiAsPromised = require("chai-as-promised"),
    {contractWrapper} = require("../../../src/contract/contract.js"),
    {configuration} = require("../../../config/configuration.js");

use(chaiAsPromised);

const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    },
    tokenOracle = (tez) => {
        return Math.floor(tez);
    },
    tezOracle = (token) => {
        return Math.floor(token);
    };

describe("Contract Wrapper", function() {
    describe("Dummy contract", function() {
        it("should complain about missing options", function() {
            expect(() => {
                return contractWrapper();
            }).to.throw(Error);
        });
    });
    describe("Token contract", function() {
        const sandbox = sinon.createSandbox(),
            contract = contractWrapper(configuration);

        beforeEach("Prepare", function() {
            sandbox.spy(contract);
        });

        afterEach("Restore", function() {
            sandbox.restore();
        });

        it("User should be able to buy some token if enough Tez is sent", async() => {
            const tezAmount = getRandomInt(10),
                tokenAmount = contract.buy(tezAmount);

            assert.deepEqual(
                await tokenAmount,
                tokenOracle(tezAmount)
            );

            expect(contract.buy.callCount).to.equal(1);
            // New tokens must be mint
            expect(contract.mint.callCount).to.equal(1);
            // New tokens must be sent
            expect(contract.send.callCount).to.equal(1);

        });

        it("User should NOT be able to buy more token than Tez is sent", async() => {
            const tezAmount = getRandomInt(10),
                tokenAmount = contract.buy(tezAmount);

            assert.deepEqual(
                await tokenAmount,
                tokenOracle(tezAmount)
            );

            expect(contract.buy.callCount).to.equal(1);
            // No tokens should be mint
            expect(contract.mint.callCount).to.equal(0);
            // No tokens should be sent
            expect(contract.send.callCount).to.equal(0);
        });

        it("Token price should be const if in the init phase", async() => {
            const tezAmount = getRandomInt(10),
                tokenAmount = contract.buy(tezAmount);

            assert.deepEqual(
                await tokenAmount,
                tokenOracle(tezAmount)
            );

            expect(contract.buy.callCount).to.equal(1);
            // New tokens must be mint
            expect(contract.mint.callCount).to.equal(1);
            // New tokens must be sent
            expect(contract.send.callCount).to.equal(1);

        });


        it("Token price should increase after the init phase", async() => {
            const tezAmount = getRandomInt(10),
                tokenAmount = contract.buy(tezAmount);

            assert.deepEqual(
                await tokenAmount,
                tokenOracle(tezAmount)
            );

            expect(contract.buy.callCount).to.equal(1);
            // New tokens must be mint
            expect(contract.mint.callCount).to.equal(1);
            // New tokens must be sent
            expect(contract.send.callCount).to.equal(1);

        });

        // Special case "beneficiary organization" is missing

        it("User should be able to sell some token and get Tez", async() => {
            const tokenAmount = getRandomInt(10),
                tezAmount = contract.sell(tokenAmount);

            assert.deepEqual(
                await tezAmount,
                tezOracle(tezAmount)
            );

            expect(contract.sell.callCount).to.equal(1);
            // Tokens must be burned
            expect(contract.burn.callCount).to.equal(1);
            // Tez must be sent
            expect(contract.send.callCount).to.equal(1);

        });

        it("User should NOT be able to sell more token than owned", async() => {
            const tezAmount = getRandomInt(10),
                tokenAmount = contract.buy(tezAmount);

            assert.deepEqual(
                await tokenAmount,
                tezOracle(tezAmount)
            );

            expect(contract.sell.callCount).to.equal(0);
            // No tokens should be burned
            expect(contract.burn.callCount).to.equal(1);
            // No tokens should be sent
            expect(contract.send.callCount).to.equal(1);

        });

        it("Organization should be able to burn its tokens", async() => {
            const tokenAmount = getRandomInt(10),
                burnedTokenAmount = contract.burn(tokenAmount);

            assert.deepEqual(
                await tokenAmount,
                burnedTokenAmount
            );

            expect(contract.burn.callCount).to.equal(1);

        });

        it("Organization should NOT be able to burn more tokens than owned", async() => {
            const tokenAmount = getRandomInt(10),
                burnedTokenAmount = contract.burn(tokenAmount);

            assert.deepEqual(
                await tokenAmount,
                burnedTokenAmount
            );

            expect(contract.burn.callCount).to.equal(0);

        });
    });

    // No direct payment from costumer at the moment
});
