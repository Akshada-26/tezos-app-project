const jq = require("jquery"),
    wrapper = require("../index.js");

jq(document).ready(() => {
    jq("#btn_buy").click(() => {
        wrapper.contract.buy(jq("#tezAmount").val()).then((message) => {
            // eslint-disable-next-line no-console
            return console.log(message);
        });
    });
});
