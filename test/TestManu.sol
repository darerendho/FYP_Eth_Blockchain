pragma solidity ^0.4.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LuxSecure.sol";

contract TestManu {

function testManufacturerDeployNewGoodContract(){
  LuxSecure ls = LuxSecure(DeployedAddresses.LuxSecure());
  bool expected = true;
  Assert.equal(ls.addNewGoods("Darren","1","Amanda","Mine","13/11/2017"),expeected,"Created a proof-of-existence");

}

}
