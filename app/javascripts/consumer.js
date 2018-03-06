//const ether = document.getElementById("eth").value;
//const url = https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD; //Ethereum Price
// var request = new XMLHttpRequest();
// request.open('GET','https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',true);
//
// request.onload = function(){
//   var data = JSON.parse(this.response);
//   var price = JSON.stringify(data);
//   ether = price;
// }
// request.send();

var contract; //Contract
var contract_address; //contract address
var contract_abi = web3.eth.contract(contractABI);

//Change the contract being worked on
async function workOnContract() {
  contract_address = document.getElementById("contract_address").value;
  contract = contract_abi.at(contract_address);
  var current_owner = await contract.getCurrentOwner(function(err, own) {
    if (err) {
      console.log(err);
    } else {
      if (own == web3.eth.accounts[0]) {
        document.getElementById("ethereum_trans_address").disabled = false;
        document.getElementById("btn_transfer").disabled = false;
        document.getElementById("status").disabled = false;
        document.getElementById("btn_status").disabled = false;
        document.getElementById("text_qr_code").value = contract_address;

        swal("Working on contract address ", contract_address);
      } else {
        swal("Error!", "You do not own the contract " + contract_address + " owner is " + own + ".");
      }
    }
  });

} //end of workOnContract

function contractOwner() {
  contract.getManufacturer(function(error, manufacturer) {
    if (!error) {
      if ("0x2fb350c462e3d20bd4637d0e1d60079c4ae3229a" == manufacturer) {
        document.getElementById('manufacturer').value = "VALIDATED";
      } else {
        document.getElementById('manufacturer').value = "Not original manufacturer.";
      }
    } else {
      console.log(error);
    }
  });
} //end contractOwner

//Trasnfer ownership from current 2nd owner to 3rd owner
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
        var tx_hash = contract.transferOwnership.sendTransaction(transfer_address, {
          from: web3.eth.accounts[0],
          gas: 4000000
        }, function(err, hash) {
          if (err) {
            console.log(err);
          } else {
            console.log(hash);
          }
        });

        swal("Your ownership has been transfered to " + transfer_address, {
          icon: "success",
        });
      } else {
        swal("Ownership retained");
      }
    });

} //end transferOwnership

//Change status of  the item from Available OR Stolen
//Stolen attribute can only be changed by the contract owner
async function changeStatus() {
  var status = document.getElementById("status").value;
  var value = +document.getElementById("ether_value").value;
  var delivery_service = document.getElementById("delivery_service").value;
  var delivery_sym;
  switch (delivery_service) {
    case "0x4a924AeD785c1E83A48939Fcc8DdDa6B326a5F08":
      delivery_sym = "DHL";
      break;
    case "0x1aD5662a8b3C5883A097e52cCc3876Ce889E063D":
      delivery_sym = "UPS";
      break;
    case "0x1faBfcE5bdE932F1ee61e7E15fA6dF59bD8D11f6":
      delivery_sym = "FeDex";
      break;
    default:
      delivery_sym = "DHL";
  }
  var retrieved_information = await contract.getStatus(function(err, stats) {
    if (err) {
      console.log(err);
    } else {
      retrieved_information = stats;
    }
  });



  if (status.localeCompare("Available") == 0) {
    if (Number.isInteger(value)) {
      if (value > 0) {
        swal({
          text: "You are setting your contract to Available thereby making your good purchaseable at an offer price of " + value + " Ether and delivered by " + delivery_sym,
          icon: "info",
          buttons: true,
          dangermode: true,
        }).then((willChangeStatus) => {
          if (willChangeStatus) {
            //Set the status to availabe
            contract.setStatus.sendTransaction(web3.fromAscii(status), {
              from: ethereum_account,
              gas: 100000
            }, function(err, stats) {
              if (err) {
                console.log(err);
              } else {
                //Set the accepted amount to transfer
                var cost = contract.deliveryCharge.sendTransaction(value, delivery_service, {
                  from: ethereum_account,
                  value: web3.toWei(0.05, "ether"),
                  gas: 200000
                }, function(err, res) {
                  if (err) {
                    console.log(err);
                  } else {
                    swal("The status has been changed to " + status + "\nPrice is set to " + value + " ether and delivery deposit of paid.", {
                      icon: "success",
                    });
                  }
                });
              }
            });

          } else {

            swal("Status remains at " + web3.toAscii(retrieved_information));
          }
        }); //end then clause
      } //end if value > 0
      else {
        swal("Please enter a greater amount");
      } //end else greater amount
    } //end if it is an integer
    else {
      swal("Please enter an ether amount ", " e.g 4 Ether");
    }

  } //end if available
  else if (status.localeCompare("Owned") == 0) {
    swal({
      text: "You are setting your contract to Owned thereby preventing anyone from sending ether to it.",
      icon: "info",
      buttons: true,
      dangermode: true,
    }).then((willChangeStatus) => {
      if (willChangeStatus) {
        contract.setStatus.sendTransaction(web3.fromAscii(status), {
          from: ethereum_account,
          gas: 100000
        }, function(err, res) {
          if (err) {
            console.log(err);
          } else {
            swal("The status has been changed to " + status, {
              icon: "success",
            });
          }
        });

      } else {
        swal("Status remains " + web3.toAscii(retrieved_information));

      }
    });

  } //end if owned
  else {
    swal({
      text: "You are setting your contract to Stolen thereby alerting others that it was stolen goods",
      icon: "warning",
      buttons: true,
      dangermode: true,
    }).then((willChangeStatus) => {
      if (willChangeStatus) {
        contract.setStatus.sendTransaction(web3.fromAscii(status), {
          from: ethereum_account,
          gas: 100000
        }, function(err, setstatus) {
          if (err) {
            console.log(err);
          } else {
            swal("The status has been changed to " + status, {
              icon: "success",
            });
          }
        });
      } else {
        swal("Status remains the " + web3.toAscii(retrieved_information));

      }
    });
  } //end if stolen
} //end getContractEther

//Get all owners from index 0 to latest
async function getAllOwners() {
  var list = "",
    model, status, date_manufactured;
  var owners = await contract.getOwners(function(err, owner) {
    if (err) {
      swal(err);
    } else {
      for (var i = 0; i < owner.length; i++) {
        list += owner[i] + "\n";
      }
      //document.getElementById("list_owners").value =  list;
      no_owners = owner.length;
      model = contract.getModel(function(err, model_res) {
        if (err) {

        } else {
          model = web3.toAscii(model_res);
          status = contract.getStatus(function(err, status_res) {
            if (err) {
              console.log(err);
            } else {
              status = web3.toAscii(status_res);
              date_manufactured = contract.getDateManufactured(function(err, res) {
                if (err) {
                  console.log(err);
                } else {
                  document.getElementById('owners').value = "The previous owners are (from first to last)\n" + list + "\nModel:" + model + "\nStatus: " + status + "\nDate Manufactured: " + web3.toAscii(res) +
                    "\nTotal number of owners: " + no_owners;
                }

              });
            }
          });
        }
      });
    }
  });

} // end getAllOwners
