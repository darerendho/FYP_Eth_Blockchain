const  express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Store = require("jfs");
const db = new Store("data");
const app = express();
const fetch = require("node-fetch");
const eth_price = "https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD";


app.use(bodyParser.urlencoded({extended: true}));

app.get('/manufacturer',function(req,res){
  var fileName = 'manufacturer.html';
  app.use("/stylesheets",express.static(__dirname + '/stylesheets'));
  app.use("/javascripts",express.static(__dirname + '/javascripts'));
  res.sendfile(fileName);
});

app.get('/consumer',function(req,res){
  var fileName = 'consumer.html';
  app.use("/stylesheets",express.static(__dirname + '/stylesheets'));
  app.use("/javascripts",express.static(__dirname + '/javascripts'));
  res.sendfile(fileName);
});

app.get('/buyer',function(req,res){
  var fileName = 'buyer.html';
  var objPrice;
  app.use("/stylesheets",express.static(__dirname + '/stylesheets'));
  app.use("/javascripts",express.static(__dirname + '/javascripts'));

  fetch(eth_price)
    .then(response => {
      response.json().then(json => {
      objPrice = json[0];
        // console.log(
        //   `Symbol: ${objPrice.symbol} -`,
        //   `Price in USD: ${objPrice.price_usd} -`,
        //   `Price in BTC: ${objPrice.price_btc}`
        // )
      });
    })
    .catch(error => {
      console.log(error);
    });

  res.send(fileName,JSON.stringify(objPrice));
});

app.get('/add_contract',function(req,res){
   var fileName = 'simplestorage.html';
   app.use("/stylesheets",express.static(__dirname + '/stylesheets'));
   app.use("/javascripts",express.static(__dirname + '/javascripts'));
   res.sendfile(fileName);
});

app.post('/contract_added',function(req,res){
  var key  = req.body.serial_number;
  var value = req.body.smart_contract;

  //1. Create key/pair json
  var pair = { key: value};
  //2. Save to json unique ID
  db.save(key,pair,function(err,id){
  });
  //3. Accept that JSON file is created.
  var obj = db.get(key);
  //res.send(obj);
  //res.sendfile(fileName);
  res.send("Added Serial Number: "+key+" and Smart Contract Address: "+value+".");
});


// app.get('/all_contracts',function(req,res){
//   var fileName = "read_contract.html";
//   var objs = db.allSync();
//   res.render(objs);
//   res.sendfile(fileName);
// });

app.listen(8080,() => console.log('Ethereum  dApp listening on @ http://localhost:8080/manufacturer'));
