pragma solidity ^0.4.4;

contract LuxSecure {
address public contract_owner;                   // Contract_owner
uint public owners_count;                        // Number of owners
mapping(uint => address) public owners_list;     // List of owners
bytes32 public model;                            // Model
bytes32 public status;                           //(Public(Owned by no one), Private(Bought by another entity),stolen(Stolen from public or private))
bytes32 public date_manufactured;                //DDMMYYYY
uint public cost;                                //Cost of good specified by seller
address buyer;                                   //Prospective buyer of good EO Address
bool purchased;                                  //Marked as purchased to prevent further funds from being added by buyer
bool accepted;                                   //Good is accepted by buyer
mapping(address =>uint256) public delivery_depo; //Delivery price
address public delivery_service;                 //Externally Owned account address or Smart contract address of delivery service


//Only Contract owner modifier
 modifier onlyOwner(){
  require(msg.sender == contract_owner || (msg.sender == buyer && accepted));
  _;
}
//Only manufacturer modifier
modifier onlyManufacturer(){
  require(msg.sender == owners_list[0]);
  _;
}
//ony buyer modifier
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
  accepted = false;
}

// Add a information new product to the blockchain with a new serial
function editContractInformation( bytes32 _model , bytes32 _status , bytes32 _date_manufactured ) public onlyManufacturer(){
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
    accepted = false;
}

//Set the status of the good - Available or Stolen
function setStatus( bytes32 _stats) public  onlyOwner(){
    status = _stats;
}

//Return manufacturer externally owned address
function getManufacturer() public constant returns(address){
  return owners_list[0];
}

//Return current owner externally owned address or smart contract address
function getCurrentOwner() public constant returns(address){
  return contract_owner;
}

//Return the number of owners who were in possesion of the good
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

//Return all the addresses that held the smart contract
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

//Return boolean value if the good is purchase(true)/not purchased(false)
function getPurchased() public constant returns(bool){
  return purchased;
}

//Return the delivery cost in ether as stated by the user
function getDeliveryCost()public constant returns(uint){
  return delivery_depo[contract_owner];
}
//Return cost of good indicated by user as ether
function getCost() constant public returns(uint){
  return cost;
}//End getCost

//Seller function
//Set cost of contract in ether and desposit in escrow
function deliveryCharge(uint _cost,address _delivery_service) payable public  onlyOwner(){
    cost = _cost;
    delivery_service  = _delivery_service;
    delivery_depo[msg.sender] += msg.value;
}

//Buyer function
//Deposit in ether to receive smart contract(Certificate of authentication and pay delivery fees as well
function sendEther(address _buyer) payable public{
  require(msg.sender != contract_owner);
  buyer = _buyer;
  purchased = true;
}//end sendEther

//Buyer function
//Buyer puts a deposit into contract
function deliveryChargeBuyer()payable public {
  delivery_depo[msg.sender] += msg.value;
}

//Buyer function
//Accept  good: Smart contract sends payment to delivery service with buyer deposit,sends payment to seller and transfer ownership to buyer
//Decline good: Smart contract sends payment to delivery service with seller deposit,returns funds to buyer and seller retains ownership of good
function acceptDelivery(bool _accept) payable public onlyBuyer(){
  uint value = delivery_depo[buyer] ;
  if(_accept){        //Send ether to contract owner if good is accepted
  accepted = true;
  delivery_depo[buyer] -= value;  //Pay delivery service from buyer desposited amount
  delivery_service.transfer(value);
  delivery_depo[contract_owner]-= value; //Return deposit to seller for sending good
  contract_owner.transfer(value);
  contract_owner.transfer(this.balance); //Transfer the balance of the contract to seller
  purchased = false;
  transferOwnership(buyer);//transfer contract ownership to seller
    }
  else{                                                 //Else refund the contract owner
    delivery_depo[contract_owner] -= value;  //Pay delivery service from seller desposited amount
    delivery_service.transfer(value);
    delivery_depo[buyer]-= value; //Return deposit to buyer for sending good
    contract_owner.transfer(value);
    buyer.transfer(this.balance);
    purchased = false;
  }
}//end acceptDeliveryFunction

}// end of LuxSecure
