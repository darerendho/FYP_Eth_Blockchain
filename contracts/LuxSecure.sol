pragma solidity ^0.4.4;
  //Notes: Cannot use require as there TestRPC/Ganache devs have yet to fix invalid opcode problem, for now work as per normal
  // TODO: Hash of the cert through IPFS Hash
contract LuxSecure {
address public contract_owner;                   // Contract_owner
uint public owners_count;                        // Number of owners
mapping(uint => address) public owners_list;     // List of owners
bytes32 public model;                            // Model
bytes32 public status;                           // (Public(Owned by no one), Private(Bought by another entity),stolen(Stolen from public or private))
bytes32 public date_manufactured;                // DDMMYYYY
uint public log_count;                           // Repair log count
mapping(uint => bytes32) public repairs;         // Repair log


// Set Owner of the Good upon deployment of smart contract to the blockchain
function LuxSecure () public{
  contract_owner = msg.sender;
}

 // Add a information new product to the blockchain with a new serial
function addNewGoods( bytes32 _model , bytes32 _status , bytes32 _date_manufactured ) public returns (bool) {//Declare Goods struct
addNewOwner(contract_owner);
model = _model;
status = _status;
date_manufactured =  _date_manufactured;
return true;
}

//Add the current owner to the list of owners
function addNewOwner(address _new_owner) private {
  owners_list[owners_count] = _new_owner;
  owners_count += 1;
}

//Transfer ownership of good to another person require()
function transferOwnership(address _transfer_owner) public{
    contract_owner = _transfer_owner;
    addNewOwner(contract_owner);
}
//Set the status of the good - Available or Stolen
//Should use rqeuire() but not working for TestRPC
function setStatus( bytes32 _stats) public{
    status = _stats;
}

//Use IPFS hash to link the repair log
//Need to clarify with sye loong once more how to implement this
function addRepairInfo(bytes32 _log) public{
      log_count += 1;
      repairs[log_count] = _log;
}

function getManufacturer() public constant returns(address){
  return owners_list[0];
}

//Return the current owner of the bag
function getCurrentOwner() public constant returns(address){
  return contract_owner;
}

//Return the number of owners who held the bag
function getNumberOfOwners() public constant returns(uint){
  return owners_count;
}

//Return the previous owner of good
function getPreviousOwner() public constant returns(address){
  if(owners_count != 0){
  uint _prev_owner = owners_count - 1;
    return owners_list[_prev_owner];
}
}

//Return the Ethereum address by index added
function getOwnerByIndex(uint _owner) public constant returns(address){
return owners_list[_owner];
}

//Returns Model of good
function getModel() public constant returns(bytes32){
  return model;
}

//Return Status of good
function getStatus() public constant returns(bytes32){
return status;
}

//Return Date Manufactured of good
function getDateManufactured() public constant returns(bytes32){
  return date_manufactured;
}

/* Pay in ether to receive smart contract(Certificate of authentication)
function sendEther(address _buyer)public{
  contract_owner.transfer(this.balance);
  transferOwnership(_buyer);
} */

}// end of LuxSecure
