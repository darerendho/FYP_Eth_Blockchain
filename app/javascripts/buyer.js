//Change the contract address
async function changeContract() {
  if(document.getElementById("smart_contract").value == ""){
    swal("Error","Please enter a valid smart contract address. Prefeably scan a QR code","warning");
  }else{
    var manufacturer, latest_owner, model, status, date_manufactured, numberOfOwners, list = "",
    owners, purchased, contract_o;
    contract_address = document.getElementById("smart_contract").value;
    contract = contract_abi.at(contract_address);

    manufacturer = await contract.getManufacturer(function(err, manu) {
      if (err) {
        swal(err);
      } else {
        manufacturer = manu;
        if ("0x2fb350c462e3d20bd4637d0e1d60079c4ae3229a" == manufacturer) {
          document.getElementById("verified").value = "Manufacturer Verified";
        } else {
          document.getElementById("verified").value = "Not original manufacturer";
        }
        swal("Working on contract address ", contract_address);
      }
    });

    latest_owner = await contract.getCurrentOwner(function(err, cO) {
      if (err) {
        swal(err);
      } else {
        document.getElementById("latest_owner").value = cO;
        contract_o = cO;
      }
    });

    model = await contract.getModel(function(err, mod) {
      if (err) {
        swal(err);
      } else {
        document.getElementById("model").value = web3.toAscii(mod);
      }
    });

    status = await contract.getStatus(function(err, stats) {
      if (err) {
        swal(err);
      } else {
        document.getElementById("status").value = web3.toAscii(stats);
      }
    });

    date_manufactured = await contract.getDateManufactured(function(err, dM) {
      if (err) {
        swal(err);
      } else {
        document.getElementById("date_manufactured").value = web3.toAscii(dM);
      }
    });

    numberOfOwners = await contract.getNumberOfOwners(function(err, nO) {
      if (err) {
        swal(err);
      } else {
        numberOfOwners = nO;

        document.getElementById("no_owners").value = numberOfOwners;
      }
    });

    owners = await contract.getOwners(function(err, owner) {
      if (err) {
        swal(err);
      } else {
        for (var i = 0; i < owner.length; i++) {
          list += (i + 1) + ")" + owner[i] + "\n";
        }
        document.getElementById("list_owners").value = list;
      }
    });


    purchased = await contract.getPurchased(function(err, purchase) {
      if (err) {
        swal(err);
      } else {
        if (purchase) { // if the good is purchased
          document.getElementById("btn_acceptdelivery").disabled = false; //Allow buyer to accept good if he has purchased
        } else if (contract_o == web3.eth.accounts[0]) {
          document.getElementById("btn_get_ownership").disabled = true; //If Owner is buyer
        } else {
          document.getElementById("btn_get_ownership").disabled = false; //Disable to prevent user from purchasing again

        }
      }
    });
  }



} //end changeContract

//Transfer ether to the contract to receive ownership
async function sendEthertoContract() {
  var stolen = "Stolen";
  var owned = "Owned";
  var current_stat, current_owner, cost_price;

  var cost = await contract.getCost(function(err, cost) {
    if (err) {
      console.log(err);
    } else {
      cost_price = cost;
      get_status = contract.getStatus(function(err, stats) {
        if (err) {
          swal(err);
        } else {
          current_stat = web3.toAscii(stats);
          var owner = contract.getCurrentOwner(function(err, c_owner) {
            if (err) {
              swal(err);
            } else {
              if (web3.eth.accounts[0] != c_owner && stolen.localeCompare(current_stat) != 0 && owned.localeCompare(current_stat) != 0) {
                swal({
                  title: "You are about the send ether to obtain a good/smart contract you wish purchase",
                  text: "The cost of the good is " + cost_price + " Ether and delivery cost of 0.05 ether.",
                  icon: "info",
                  buttons: true,
                  dangermode: true,
                }).then((willSendEther) => {
                  if (willSendEther) {
                    var payment_tx = contract.sendEther.sendTransaction(web3.eth.accounts[0], {
                      from: web3.eth.accounts[0],
                      value: web3.toWei(cost_price, "ether")
                    }, function(err, tx) {
                      if (err) {
                        swal(err);
                      } else {

                        contract.deliveryChargeBuyer.sendTransaction({
                          from: web3.eth.accounts[0],
                          value: web3.toWei(0.05, "ether")
                        }, function(err, tx) {
                          if (err) {
                            swal(err);
                          } else {
                            document.getElementById("btn_get_ownership").disabled = true;
                            document.getElementById("btn_acceptdelivery").disabled = false;

                            swal("Transfer has been made to seller!", "Upon delivery of good, acknowledge that you have received the good else ownership will be kept by the seller.");
                          }
                        });



                      }
                    });

                  } else {
                    swal("Ether not sent");
                  }
                }); //end then clause
              } //end if not owned, not stolen and not ownerd
              else {
                if (stolen.localeCompare(current_stat) == 0) {
                  swal("This good is stolen from the orginal owner.\n DO NOT PURCHASE AND REPORT TO AUTHORITIES");
                } else if (owned.localeCompare(current_stat) == 0) {
                  swal("The good is currently owned and not available for purchase");
                } else {
                  swal("You already own this smart contract.");
                }
              } //end else if stolen/owned
            }
          }); //end await contract getOwner
        }
      }); //end await getStatus
    }
  });

} //end sendEtherForContract

//Upon delivered to user accept good, verify and accept good
function acceptDelivery() {
  swal({
      title: "You are accepting the delivery of good and verified the authenticity",
      text: "Once complete, funds will be transferred to seller and ownership will be gained.",
      icon: "warning",
      buttons: true,
      dangermode: true,
    })
    .then((willAccept) => {

      if (willAccept) {
        var tx_hash = contract.acceptDelivery.sendTransaction(true, {
          from: ethereum_address,
          gas: 4000000
        }, function(err, res) {
          if (err) {
            swal(err);
          } else {
            contract.getCurrentOwner(function(err, cO) {
              if (err) {
                swal(err);
              } else {
                swal("Your will has been ownership from " + cO + " and funds transferred to seller ", {
                  icon: "success",
                });
              }
            });
          }
        });

      } else {
        contract.acceptDelivery.sendTransaction(false, {
          from: ethereum_address,
          gas: 4000000
        }, function(err, refunded) {
          if (err) {
            swal(err);
          } else {
            swal({
              title: "Funds have been refunded back to you",
              text: "Check your accoutn again"
            });
          }
        });

      }
    });
} //end acceptDelivery
