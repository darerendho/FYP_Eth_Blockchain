# Ethereum anti-counterfeiting DApp
The main purpose of this project is to create a new method of anti-counterfeiting measures utilising the Ethereum Blockchain. This is can be implemented in a real blockchain however, the user interface is fixed for easier selection of external owned accounts to select accounts with.  
# To run (might still have bugs):
1. Install MetaMask on either Chrome or Mozilla firefox as these are the web browsers that currently support MetaMask.
2. Login into the Metamask and save seeed words.
3. Create 6 accounts on MetaMask the Rinkby test network and populate the first 1,2 and 6th accounts with ether through "https://www.rinkeby.io/#faucet".
4. Change the ethereum addresses for following files "manufacturer.html","consumer.html" and "buyer.html".
  * Manufacturer - 1st account
  * Consumer - 2nd
  * DHS - 3rd account
  * UHL - 4th account
  * FeDex - 5th account
  * Buyer - 6th account
5. Install Node or npm in order to run the app.js in ./app/app.js. Run command at root of older "npm run ./app/app.js". or run server.sh on "./app/server.sh"
6. Open "localhost:8080/manufacturer"
7. Deploy contract as manuafacturer on [Remix IDE](https://remix.ethereum.org/)  using "./contract/LuxSecure.sol" contract as the contract code to be deployed. Deploy as manufacturer account.
