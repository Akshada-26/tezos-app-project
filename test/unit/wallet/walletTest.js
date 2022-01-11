const {use, expect} = require("chai"),
    sinon = require("sinon"),
    chaiAsPromised = require("chai-as-promised"),
    {walletWrapper} = require("../../../src/wallet/wallet.js"),
    {configuration} = require("../../../config/configuration.js");

use(chaiAsPromised);

describe("Wallet Wrapper", function() {
    describe("Dummy wallet", function() {
        it("should complain about missing options", function() {
            expect(() => {
                return walletWrapper();
            }).to.throw(Error);
        });
    });
    describe("Wallet action", function() {
        const config = configuration(),
            sandbox = sinon.createSandbox(),
            requestPermission = sandbox.spy(function() {
                return Promise.resolve(null);
            }),
            checkPermissionsTrue = sandbox.spy(function() {
                return Promise.resolve(null);
            }),
            checkPermissionsFalse = sandbox.spy(function() {
                return Promise.reject(new Error("No permission"));
            });

        beforeEach("Prepare", function() {
            sandbox.spy();
        });

        afterEach("Restore", function() {
            sandbox.restore();
        });

        it("should return PKH", async function() {
            const BeaconWallet = function(options) {
                    const client = {
                        "requestPermissions": () => {
                            return requestPermission();
                        },
                        "checkPermissions": () => {
                            return checkPermissionsTrue();
                        }
                    };

                    return {client,
                        options};
                },
                wallet = walletWrapper({
                    "SDK": BeaconWallet,
                    "network": config.chain,
                    "name": "TZMINT"
                });
            const permission = await wallet.requestPermission();

            expect(permission.options.name).to.equal("TZMINT");

        });

        it("should return PKH after permission request", async function() {
            const BeaconWallet = function(options) {
                    const client = {
                        "requestPermissions": () => {
                            return requestPermission();
                        },
                        "checkPermissions": () => {
                            return checkPermissionsFalse();
                        }
                    };

                    return {client,
                        options};
                },
                wallet = walletWrapper({
                    "SDK": BeaconWallet,
                    "network": config.chain,
                    "name": "TZMINT"
                });
            const permission = await wallet.requestPermission();

            expect(permission.options.name).to.equal("TZMINT");

            expect(checkPermissionsFalse.callCount).to.equal(1);
            expect(requestPermission.callCount).to.equal(1);
        });
    });
});
