const fetch = require("node-fetch");
const eth_price =
  "https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD";
fetch(url)
  .then(response => {
    response.json().then(json => {
    var objPrice = json[0];
      console.log(
        `Symbol: ${objPrice.symbol} -`,
        `Price in USD: ${objPrice.price_usd} -`,
        `Price in BTC: ${objPrice.price_btc}`
      );
    });
  })
  .catch(error => {
    console.log(error);
  });
