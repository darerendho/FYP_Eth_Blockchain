const  express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Store = require("jfs");
const db = new Store("data");
const app = express();
const fetch = require("node-fetch");

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

  app.use("/stylesheets",express.static(__dirname + '/stylesheets'));
  app.use("/javascripts",express.static(__dirname + '/javascripts'));

  res.sendfile(fileName);
});

app.listen(8080,() => console.log('Ethereum  dApp listening on @ http://localhost:8080/manufacturer'));
