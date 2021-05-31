const {use, expect} = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    {walletWrapper} = require("../../../src/wallet/wallet.js"),
    {configuration} = require("../../../config/configuration.js");

use(chaiAsPromised);

describe("Wallet Wrapper", function() {
    describe("Dummy wallet", function() {
        it("should complain about missing private Key", function() {
            expect(() => {
                return walletWrapper();
            }).to.throw(Error);
        });
    });
    describe("Actions", function() {
        const config = configuration();

        it("should be able to check balance", function() {
            const wallet = walletWrapper(config);

            wallet.balance();
        });

        it("should be able to check balance", function() {
            const wallet = walletWrapper(config);

            wallet.balance();
        });
        it("should be able to sign a transaction", function() {
            const wallet = walletWrapper(config);

            wallet.sign();
        });
    });
});
