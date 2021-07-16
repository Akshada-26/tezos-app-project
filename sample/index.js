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
});
