const {use, expect} = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    {walletWrapper} = require("../../../src/wallet/wallet.js");

use(chaiAsPromised);

describe("Wallet Wrapper", function() {
    describe("Dummy wallet", function() {
        it("should complain about missing options", function() {
            expect(() => {
                return walletWrapper();
            }).to.throw(Error);
        });
    });
});
