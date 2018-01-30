var http = require('http');
var Store = require("jfs");
var db = new Store("./scontracts.json");
var fs = require('fs');
var server = http.createServer(function(req, res) {
  // res.writeHead(200);
  // res.end('Hello Http');
  if(req.url == "/manufacturer"){
    fs.readFile("./manufacturer.html",function(error,pgResp){
        if(error){
            res.writeHead(404);
            res.write('Contents you are looking for is not found');
        }
        else{
          res.writeHead(200,{'Content-Type': 'text/html'});
          res.write(pgResp);
        }
      res.end();
    });
  }//end /manufacturer
  else if(req.url == "/consumer"){
      fs.readFile("./consumer.html",function(error,pgResp){
        if(error){
          res.writeHead(404);
          res.write('Contents you are looking for is not found');
        }
        else{
            res.writeHead(200,{'Content-Type': 'text/html'});
            res.write(pgResp);
        }
      });
  }//end /consumer
  else if(req.url == "/buyer"){
    fs.readFile("./buyer.html",function(error,pgResp){
      if(error){
        res.writeHead(404);
        res.write('Contents you are looking for is not found');
      }
      else{
          res.writeHead(200,{'Content-Type': 'text/html'});
          res.write(pgResp);
      }
    });
  }//end /buyer
  else{
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write('<h1>Wrong page </h1><br/><br/> Use these links insted:'+res.url);
    res.end();
  }
});
server.listen(8080);

console.log("Server started listening on 8080");


//
// //1 Create data
// var d = {foo: "bar"};
// //2 Write file
// db.save("anId",d,function(err){});
// //3 read file
// //Get singular item in the file
// db.get("anId",function(err,obj){
//
// });
// //get all items in json verificationOfManAndLatestOwner
// db.all(function(err,obj){
// //objs is a map: ID => object
// });
