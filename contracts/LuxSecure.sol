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
uint public cost;                                //Cost of good specified by seller
address buyer;                                   //Prospective buyer of good EO Address
bool purchased;                                  //Marked as purchased to prevent further funds from being added by buyer
mapping(address =>uint256) public delivery_depo;  //Delivery price
address public delivery_service;                        //

//Only Contract owner modifier
 modifier onlyOwner(){
  require(msg.sender == contract_owner || msg.sender == buyer);
  _;
}
//Only manufacturer modifier
modifier onlyManufacturer(){
  require(msg.sender == owners_list[0]);
  _;
}

modifier onlyBuyer(){
  require(msg.sender == buyer);
  _;
}

// Set Owner of the Good upon deployment of smart contract to the blockchain
function LuxSecure () public{
  contract_owner = msg.sender;
  purchased = false;
  owners_list[owners_count] = msg.sender;
  owners_count += 1;
}

 // Add a information new product to the blockchain with a new serial
function addNewGoods( bytes32 _model , bytes32 _status , bytes32 _date_manufactured ) public onlyManufacturer(){//Declare Goods struct
model = _model;
status = _status;
date_manufactured =  _date_manufactured;
}

//Transfer ownership of good to another person require()
function transferOwnership(address _transfer_owner) public onlyOwner(){
    contract_owner = _transfer_owner;
    owners_list[owners_count] = _transfer_owner;
    owners_count += 1;
    buyer = 0x0;
}
//Set the status of the good - Available or Stolen
//Should use rqeuire() but not working for TestRPC
function setStatus( bytes32 _stats) public  onlyOwner(){
  //Doesn't work for local TestRPC
  //require(msg.sender ==contract_woner);
    status = _stats;
}

//Proposed to do
//Use IPFS hash to link the repair log
//Need to clarify with sye loong once more how to implement this
function addRepairInfo(bytes32 _log) public onlyOwner(){
  //require()
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

//Need to do some work with this one
//Return the Ethereum address by index added
function getOwners() public constant returns(address[]){
address[] memory addresses = new address[](owners_count);
for(uint i = 0;i<owners_count;i++){
  addresses[i] = owners_list[i];
}
return addresses;
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

function getPurchased() public constant returns(bool){
  return purchased;
}

//Get delivery cost_price
function getDeliveryCost()public constant returns(uint){
  return delivery_depo[contract_owner];
}

function getCost() constant public returns(uint){
  return cost;
}//End getCost

/* //Specify the cost in ether fo purchase of good and certificate of authentication
function specifyCost(uint _cost) public onlyOwner(){
  //Doesn't work for local TestRPC
  cost = _cost;

} */

//Seller function
//Set cost of contract in ether and set delivery escrow
function deliveryCharge(uint _cost,address _delivery_service) payable public  onlyOwner(){
    cost = _cost;
    delivery_service  = _delivery_service;
    delivery_depo[msg.sender] += msg.value;
}

//Buyer function
// Pay in ether to receive smart contract(Certificate of authentication and pay delivery fees as well
function sendEther(address _buyer) payable public{
  require(msg.sender != contract_owner);
  buyer = _buyer;
  purchased = true;
}//end sendEther

//Buyer function
function deliveryChargeBuyer()payable public {
  delivery_depo[msg.sender] += msg.value;
}


//Accept good else refund to user
function acceptDelivery(bool _accept) payable public onlyBuyer(){
  uint value = delivery_depo[buyer] ;
  if(_accept){        //Send ether to contract owner if good is accepted

  delivery_depo[buyer] -= value;  //Pay delivery service from buyer desposited amount
  delivery_service.transfer(value);

  delivery_depo[contract_owner]-= value; //Return deposit to seller for sending good
  contract_owner.transfer(value);

  contract_owner.transfer(this.balance); //Transfer the balance of the contract to seller
  purchased = false;

  transferOwnership(buyer);//transfer contract ownership to seller
  //return true;
    }
  else{                                                 //Else refund the contract owner
    delivery_depo[contract_owner] -= value;  //Pay delivery service from seller desposited amount
    delivery_service.transfer(value);

    delivery_depo[buyer]-= value; //Return deposit to buyer for sending good
    contract_owner.transfer(value);

    buyer.transfer(this.balance);
    purchased = false;
    //return false;
  }
}//end acceptDeliveryFunction

}// end of LuxSecure
