pragma solidity ^0.4.4;

contract ERC20Interface{
  // Get the total token supply

  function totalSupply() constant returns (uint256 totalSupply);

  // Get the account balance of another account with address _owner

  function balanceOf(address _owner) constant returns (uint256 balance);

  // Send _value amount of tokens to address _to

  function transfer(address _to, uint256 _value) returns (bool success);

  // Send _value amount of tokens from address _from to address _to

  function transferFrom(address _from, address _to, uint256 _value) returns (bool success);


  // Allow _spender to withdraw from your account, multiple times, up to the _value amount.
  // If this function is called again it overwrites the current allowance with _value.
  // this function is required for some DEX functionality
  function approve(address _spender, uint256 _value) returns (bool success);

  // Returns the amount which _spender is still allowed to withdraw from _owner

  function allowance(address _owner, address _spender) constant returns (uint256 remaining);

  // Triggered when tokens are transferred.

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  // Triggered whenever approve(address _spender, uint256 _value) is called.

  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

}

contract Nexion is ERC20Interface {
  uint256 constant MAX_UINT256 = 2**256 - 1;

  string public constant symbol = "NXI";
  string public constant name = "Nexion Token";
  uint8 public constant decimals = 18;
  uint256 _totalSupply = 10000000000; // 10 Billion

  //Owner of each account
  address public owner;

  //balance of each acccount
  mapping(address => uint256) balances;

  //Owner of account approves the transfer of an amount to another accounts
  mapping(address => mapping(address => uint256)) allowed;

  //Functions with this modifier can only be executed by the owner\
  //Does not work in either TestRPC or GanacheCLI
  modifier onlyOwner(){
      require(owner == msg.sender);
    _;
  }

  //isConstructor
  function Nexion() public{
    owner = msg.sender;
    balances[owner] = _totalSupply; //Creator has all initial tokens
  }

  //Return total supply of all tokens
  function totalSupply() public constant returns(uint256 tSupply){
  return _totalSupply;
  }

  //Return token balance per aacount
  function balanceOf(address _owner) public constant returns(uint256 balance){
    return balances[_owner];
  }

  //Transfer the balance from owner's account to another Account
  function transfer(address _to, uint256 _amount) public returns (bool success){    //Replace with view in later version
        require(balances[msg.sender] >= _amount && balances[_to] + _amount > balances[_to]);
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        Transfer(msg.sender,_to, _amount);
        return true;
  }

  // Send _value amount of tokens from address _from to address _to
  // The transferFrom method is used for a withdraw workflow, allowing contracts to send
  // tokens on your behalf, for example to "deposit" to a contract address and/or to charge
  // fees in sub-currencies; the command should fail unless the _from account has
  // deliberately authorized the sender of the message via some mechanism; we propose
  // these standardized APIs for approval:
  function transferFrom(address _to, address _from, uint256 _amount) public returns (bool success){
    require(balances[_from] >= _amount && allowed[_from][msg.sender] >= _amount && balances[_to] + _amount > balances[_to]);
    uint256 allowance = allowed[_from][msg.sender];
    require(balances[_from] >= _amount && allowance >= _amount);
    balances[_from] -= _amount;
    balances[_to] += _amount;
    if(allowance < MAX_UINT256){
    allowed[_from][msg.sender] -= _amount;
    }
    Transfer(_from, _to, _amount);
    return true;
  }

// Allow _spender to withdraw from your account, multiple times, up to the _amount amount.
// If this function is called again it overwrites the current allowance with _amount.
function approve(address _spender, uint256 _amount) public returns (bool success) {
    allowed[msg.sender][_spender] = _amount;
    Approval(msg.sender, _spender, _amount);
    return true;
}

}
