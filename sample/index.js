const jq = require("jquery"),
    wrapper = require("../index.ts");

jq(document).ready(() => {
    jq("#btn_buy").click(() => {
        wrapper.contract.buy(jq("#tezAmount").val()).then((message) => {
            // eslint-disable-next-line no-console
            return console.log(message);
        });
    });
    jq("#btn_sell").click(() => {
        wrapper.contract.sell(jq("#tokenAmount").val()).then((message) => {
            // eslint-disable-next-line no-console
            return console.log(message);
        });
    });
    jq("#btn_fetch").click(() => {
        wrapper.chain.storage().then((data) => {
            return jq("#storage").html(JSON.stringify(data));
        });
    });
    jq("#btn_totalTokens").click(() => {
        wrapper.chain.totalTokens().then((data) => {
            return jq("#totalTokens").html(data);
        });
    });
    jq("#btn_totalInvestors").click(() => {
        wrapper.chain.totalInvestors().then((data) => {
            return jq("#totalInvestors").html(data);
        });
    });
    jq("#btn_totalInvestments").click(() => {
        wrapper.chain.totalInvestments().then((data) => {
            return jq("#totalInvestments").html(data);
        });
    });
    jq("#btn_companyValuation").click(() => {
        wrapper.chain.companyValuation().then((data) => {
            return jq("#companyValuation").html(data);
        });
    });
    jq("#btn_buyPrice").click(() => {
        wrapper.chain.buyPrice().then((data) => {
            return jq("#buyPrice").html(data);
        });
    });
    jq("#btn_sellPrice").click(() => {
        wrapper.chain.sellPrice().then((data) => {
            return jq("#sellPrice").html(data);
        });
    });
    jq("#btn_administrator").click(() => {
        wrapper.chain.administrator().then((data) => {
            return jq("#administrator").html(data);
        });
    });
    jq("#btn_reserveAmount").click(() => {
        wrapper.chain.reserveAmount().then((data) => {
            return jq("#reserveAmount").html(data);
        });
    });
    jq("#btn_baseCurrency").click(() => {
        wrapper.chain.baseCurrency().then((data) => {
            return jq("#baseCurrency").html(data);
        });
    });
    jq("#btn_totalAllocation").click(() => {
        wrapper.chain.totalAllocation().then((data) => {
            return jq("#totalAllocation").html(data);
        });
    });
    jq("#btn_stakeAllocation").click(() => {
        wrapper.chain.stakeAllocation().then((data) => {
            return jq("#stakeAllocation").html(data);
        });
    });
    jq("#btn_initialReserve").click(() => {
        wrapper.chain.initialReserve().then((data) => {
            return jq("#initialReserve").html(data);
        });
    });
    jq("#btn_terminationEvents").click(() => {
        wrapper.chain.terminationEvents().then((data) => {
            return jq("#terminationEvents").html(JSON.stringify(data));
        });
    });
    jq("#btn_administrator").click(() => {
        wrapper.chain.administrator().then((data) => {
            return jq("#administrator").html(data);
        });
    });
    jq("#btn_mfg").click(() => {
        wrapper.chain.mfg().then((data) => {
            return jq("#mfg").html(data);
        });
    });
    jq("#btn_buyslope").click(() => {
        wrapper.chain.buySlope().then((data) => {
            return jq("#buyslope").html(data);
        });
    });
    jq("#btn_sellslope").click(() => {
        wrapper.chain.sellSlope().then((data) => {
            return jq("#sellslope").html(data);
        });
    });
    jq("#btn_i").click(() => {
        wrapper.chain.i().then((data) => {
            return jq("#i").html(data);
        });
    });
    jq("#btn_d").click(() => {
        wrapper.chain.d().then((data) => {
            return jq("#d").html(data);
        });
    });
    jq("#btn_unlockingDate").click(() => {
        wrapper.chain.unlockingDate().then((data) => {
            return jq("#unlockingDate").html(data);
        });
    });
    jq("#btn_burnedTokens").click(() => {
        wrapper.chain.burnedTokens().then((data) => {
            return jq("#burnedTokens").html(data);
        });
    });
    jq("#btn_totalInvestors").click(() => {
        wrapper.chain.totalInvestors().then((data) => {
            return jq("#totalInvestors").html(data);
        });
    });
    jq("#btn_user").click(() => {
        wrapper.chain.user(jq("#userAddress").val()).buyed()
            .then((data) => {
                return jq("#buyed").html(JSON.stringify(data));
            });
        wrapper.chain.user(jq("#userAddress").val()).selled()
            .then((data) => {
                return jq("#selled").html(JSON.stringify(data));
            });
        wrapper.chain.user(jq("#userAddress").val()).tezInvested()
            .then((data) => {
                return jq("#tezInvested").html(data);
            });
        wrapper.chain.user(jq("#userAddress").val()).tez()
            .then((data) => {
                return jq("#tez").html(data);
            });
    });
});
