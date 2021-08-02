/* eslint-disable no-unused-vars */

const {expect, use, assert} = require("chai"),
    sinon = require("sinon"),
    chaiAsPromised = require("chai-as-promised"),
    {walletWrapper} = require("../../../src/wallet/wallet.js"),
    {contractWrapper} = require("../../../src/contract/contract.js"),
    {configuration} = require("../../../config/configuration.js");

use(chaiAsPromised);

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
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
            }),
            buy = sandbox.spy(function() {
                return Promise.resolve(null);
            }),
            sell = sandbox.spy(function() {
                return Promise.resolve(null);
            }),
            pay = sandbox.spy(function() {
                return Promise.resolve(null);
            }),
            burn = sandbox.spy(function() {
                return Promise.resolve(null);
            }),
            BeaconWallet = function(options) {
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
            TezosToolkit = function(options) {
                const setWalletProvider = () => {
                        return null;
                    },
                    wallet = {
                        "at": (address) => {
                            return Promise.resolve({
                                "methods": {
                                    buy,
                                    sell,
                                    burn,
                                    pay
                                }
                            });
                        }
                    };

                return {setWalletProvider,
                    wallet,
                    options};
            },
            wallet = walletWrapper({
                "SDK": BeaconWallet,
                "network": config.chain,
                "name": "TZMINT"
            }),
            contract = contractWrapper({"SDK": TezosToolkit,
                wallet,
                "contractAddress": null,
                "provider": null});

        beforeEach("Prepare", function() {
            sandbox.spy();
        });

        afterEach("Restore", function() {
            sandbox.restore();
        });

        it("should contain buy, sell, pay and burn", function() {
            expect(contract).to.have.property("buy");
            expect(contract).to.have.property("sell");
            expect(contract).to.have.property("burn");
            expect(contract).to.have.property("pay");
        });


        it("should call only buy in the contract if buy is called", async function() {
            expect(contract).to.have.property("buy");
            const result = await contract.buy(getRandomInt(10));

            expect(buy.callCount).to.equal(1);
            expect(burn.callCount).to.equal(0);
            expect(sell.callCount).to.equal(0);
            expect(pay.callCount).to.equal(0);
        });
    });
});
