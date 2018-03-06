var contract_address // Contract Address
var contract; // Contract instance
var contract_abi = web3.eth.contract(contractABI);
//web3.eth.contract(contract_abi); // contract ABI

//Change the contract being worked on
function workOnContract() {
  contract_address = document.getElementById("contract_address").value;
  contract = contract_abi.at(contract_address);
  var validate;
  contract.getManufacturer(function(err, res) {
    if (err) {
      console.warn(err);
    } else {
      if (web3.eth.defaultAccount == res) {
        swal("Contract changed to ", "Address: " + contract_address);
        document.getElementById("text_qr_code").value = contract_address
        document.getElementById("transfer_ownership").disabled = false;
        document.getElementById("model").disabled = false;
        document.getElementById("status").disabled = false;
        document.getElementById("ethereum_trans_address").disabled = false;
        document.getElementById("date_manufactured").disabled = false;
        document.getElementById("addinfobutton").disabled = false;
      } else {
        document.getElementById("contract_address").value = "";
        swal("Error", "Address is either invalid smart contract address or you do not own the contract" + contract_address, "warning");
      }
    }


  });
} //end of workOnContract

//Add basic information about the Certificate of Authtenticity
async function addInfoContract() {
  var tx_hash;
  var _model, _status, _date_manufactured;

  var model = web3.fromAscii(document.getElementById("model").value);
  var status = web3.fromAscii(document.getElementById("status").value);
  var date_manufactured = web3.fromAscii(document.getElementById("date_manufactured").value);

  var add_promise = await contract.editContractInformation.sendTransaction(model, status, date_manufactured, {
    from: web3.eth.accounts[0],
    gas: 4000000,
  }, function(err, result) {
    if (err) {
      swal(err);
    } else {
      tx_hash = result;
      swal("Model :" + web3.toAscii(model) + "\nStatus :" + web3.toAscii(status) + "\nData Manufactured :" + web3.toAscii(date_manufactured) + "\nCheck MetaMask for transaction success.", {
        icon: "success",
      });
    }
  });

} //end addInfoContract

//Transfer ownership of smart contract(Certificate of Authtenticity)
function transferOwnership() {
  var transfer_address = document.getElementById("ethereum_trans_address").value;

  swal({
      title: "You are transfering certifaction ownership",
      text: "Once transfered to another entity you will not be able to regain ownership of smart contract",
      icon: "warning",
      buttons: true,
      dangermode: true,
    })
    .then((willTransfer) => {

      if (willTransfer) {
        contract.transferOwnership.sendTransaction(transfer_address, {
          from: web3.eth.accounts[0],
          gas: 4000000
        }, function(err, res) {
          if (err) {
            swal(err);
          } else {
            swal("Your ownership has been transfered to " + transfer_address, {
              icon: "success",
            });
          }
        });
        //var _current_owner = contract.getCurrentOwner();
      } else {
        swal("Ownership retained");
      }
    });
} //end of transfer ownnership
