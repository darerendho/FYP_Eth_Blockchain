pragma solidity ^0.4.4;

  // TODO: Hash of the cert through IPFS Hash
contract LuxSecure {
address public manufacturer;           //Manufacturer
string public current_owner;    //Current Owner of good
string public model;            //Model
string public previous_owner;   // Perhaps to trace back the less owner like a back-linked list?
string public status;           // (Public(Owned by no one), Private(Bought by another entity),stolen(Stolen from public or private))
string public date_manufactured;   //Time in Unix Epoch

// Set Owner of the Bag
function manufacturer() public{
  manufacturer = msg.sender;
}

 // Add a new product to the blockchain with a new serial
function addNewGoods(string _current_owner,string _model,string _previous_owner,string _status, string _date_manufactured) public returns(bool made) {//Declare Goods struct
current_owner = _current_owner;
model = _model;
previous_owner = _previous_owner;
status = _status;
date_manufactured =  _date_manufactured;
return true;
}

function getManufacturer() constant public returns(address){
  return manufacturer;
}

function getCurrentOwner() constant public returns(string){
  return current_owner;
}

function getModel() constant public returns(string){
  return model;
}

function getPreviousOwner() constant public returns(string){
  return previous_owner;
}

function getStatus() constant public returns(string){
return status;
}

function getDateManufactured() constant public returns(string){
  return date_manufactured;
}

}// end of LuxSecure
