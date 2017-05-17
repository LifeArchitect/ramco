// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Decode the blockchain hash into input params
const InputDataDecoder = require('ethereum-input-data-decoder');

import supply_artifacts from '../../build/contracts/Supply.json'

var Supply = contract(supply_artifacts);

// abi definition necessary for the decoding
var abi = supply_artifacts.abi;

let tokenPrice = null;

window.getParts = function() {
  var table = $("#parts");
  table.html("<thead><th>Serial</th><th>Part Name</th><th>Current Owner</th></thead><tbody>");
  Supply.deployed().then(function(contractInstance) {
    contractInstance.getAllParts({gas: 140000, from: web3.eth.accounts[0]}).then(function(parts) {
      parts.forEach(function(serial) {
        var row = "<tr>";
        row += "<td>" + serial + "</td>";
        contractInstance.getPart(serial.c[0],{gas: 140000, from: web3.eth.accounts[0]}).then(function (part) {
          var name = new Buffer(part[0].toString().substring(2), 'hex');
          var owner = new Buffer(part[1].toString().substring(2), 'hex');
          row += "<td>" + name + "</td>";
          row += "<td>" + owner.toString() + "</td>";
          row += "</tr>";
          table.append(row);
        });
      });
    });
  });
  table.append("</tbody>");
}

window.transfer_ownership = function() {
  var id = $("#partIDtransfer").val();
  var from = $("#from").val();
  var to = $("#to").val();
  console.log(id, from, to);
  Supply.deployed().then(function(contractInstance) {
    contractInstance.transferOwnership(from, to, id, {gas: 140000, from: web3.eth.accounts[0]}).then(function(contract) {
      // reload the parts
      console.log(contract.tx);
      contractInstance.storeTransaction(id, contract.tx, {gas: 140000, from: web3.eth.accounts[0]}).then(function(result) {
        console.log("stored");
      });
      getParts();
    });
  });
  return false;
}


window.search_history = function() {
  const decoder = new InputDataDecoder(abi);

  var id = $("#partIDsearch").val();
  var table = $("#partHistory");
  table.html("<thead><th>Transaction</th><th>From</th><th>To</th></thead><tbody>");
  Supply.deployed().then(function(contractInstance) {
    contractInstance.getTransaction(id, {gas: 140000, from: web3.eth.accounts[0]}).then(function(results) {
      results.forEach(function(transaction) {
        var row = "<tr>";
        var data = web3.eth.getTransaction(transaction).input;
        var result = decoder.decodeData(data);
        var from = result.inputs[0];
        var to = result.inputs[1];
        row += "<td>" + transaction + "</td>";
        row += "<td>" + from + "</td>";
        row += "<td>" + to + "</td>";
        row += "</tr>";
        table.append(row);
      });
    });
  });
  table.append("</tbody>");
}

/* The user enters the total no. of tokens to buy. We calculate the total cost and send it in
 * the request. We have to send the value in Wei. So, we use the toWei helper method to convert
 * from Ether to Wei.
 */

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Supply.setProvider(web3.currentProvider);
  getParts();
});