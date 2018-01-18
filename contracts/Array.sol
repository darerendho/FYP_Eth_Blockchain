pragma solidity ^0.4.4;

contract Array {

 uint[] someNumbers;

 function getArray() public constant returns (uint[]) {
         return someNumbers;
 }

 function setArray(uint[] setNumbers) public  {

  someNumbers = setNumbers;

 }

}
