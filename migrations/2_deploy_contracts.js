//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");
var Luxcure = artifacts.require("./LuxSecure.sol");
module.exports = function(deployer) {
  deployer.deploy(Luxcure);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);
};
