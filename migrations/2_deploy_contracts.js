//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");
var Luxcure = artifacts.require("./LuxSecure.sol");
var Nexion =  artifaccts.require("./Nexion.sol");
module.exports = function(deployer) {
  deployer.deploy(Luxcure);
  deployer.deploy(Nexion);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);
};
