// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Decode the blockchain hash into input params
const InputDataDecoder = require('ethereum-input-data-decoder');

import supply_artifacts from '../../build/contracts/Supply.json'
import flight_artifacts from '../../build/contracts/Flight.json'
import partpool_artifacts from '../../build/contracts/PartPool.json'

var Supply = contract(supply_artifacts);
var Flight = contract(flight_artifacts);
var PartPool = contract(partpool_artifacts);

// abi definition necessary for the decoding
var supply_abi = supply_artifacts.abi;
var flight_abi = flight_artifacts.abi;
var partpool_abi = partpool_artifacts.abi;

var contract_instance;

window.manufacture = function() {
  var date = Date.now().toString();
  var partNo = $("#partNo_M").val();
  var serialNo = $("#serialNo_M").val();;
  var description = $("#description_M").val();
  var owner = $("#manufacturer").val();
  contract_instance.manufacture(partNo, serialNo, description, owner, date, {gas: 1400000, from: web3.eth.accounts[0]}).then(function (trans) {
    console.log(trans);
    console.log(trans.tx);
    contract_instance.addPartHistory(serialNo, trans.tx, {gas: 140000, from: web3.eth.accounts[0]});
  });
}

window.sell = function() {
  var date = Date.now().toString();
  var serialNo = $("#serialNo_S").val();
  var buyer = $("#buyer").val();
  contract_instance.sell(serialNo, buyer, date, {gas: 1400000, from: web3.eth.accounts[0]}).then(function (trans) {
    console.log(trans);
    console.log(trans.tx);
    contract_instance.addPartHistory(serialNo, trans.tx, {gas: 140000, from: web3.eth.accounts[0]});
  });
}

window.install = function() {
  var date = Date.now().toString();
  var serialNo = $("#serialNo_I").val();
  var tailNo = $("#tailNo_I").val();;
  var installer = $("#installer").val();
  contract_instance.install(serialNo, tailNo, installer, date, {gas: 1400000, from: web3.eth.accounts[0]}).then(function (trans) {
    console.log(trans);
    console.log(trans.tx);
    contract_instance.addPartHistory(serialNo, trans.tx, {gas: 140000, from: web3.eth.accounts[0]});
  });
}

window.loan = function() {
  var date = Date.now().toString();
  var serialNo = $("#serialNo_L").val();
  var timeToReturn = $("#timeToReturn").val();
  var borrower = $("#borrower").val();
  contract_instance.loan(serialNo, borrower, timeToReturn, date, {gas: 1400000, from: web3.eth.accounts[0]}).then(function (trans) {
    console.log(trans);
    console.log(trans.tx);
    contract_instance.addPartHistory(serialNo, trans.tx, {gas: 140000, from: web3.eth.accounts[0]});
  });
}

window.search_part_history = function() {
  var date = Date.now().toString();
  const decoder = new InputDataDecoder(supply_abi);
  var id = $("#partIDsearch").val();
  var table = $("#partHistory");
  table.html("<thead><th>Transaction Hash</th><th>Description</th><th>Time</th></thead><tbody>");
  contract_instance.searchPartHistory(id, date, {gas: 1400000, from: web3.eth.accounts[0]}).then(function(results) {
    console.log(results);
    results.forEach(function(transaction) {
      var row = "<tr>";
      var hash = transaction;
      var data = web3.eth.getTransaction(transaction).input;
      var result = decoder.decodeData(data);
      var description;
      var time;
      console.log(result);
      switch(result.name){
        case "manufacture":
          description = "Manufactured by " + result.inputs[3];
          time = result.inputs[4];
          break;
        case "install":
          description = "Installed by " + result.inputs[2] + " on to aircraft with tail number " + result.inputs[1];
          time = result.inputs[3];
          break;
        case "sell":
          description = "Sold <br />Ownership transfered to " + result.inputs[1];
          time = result.inputs[2];
          break;
        default:
          description = "No description";
          break;
      }
      time = new Date(parseInt(time));
      row += "<td>" + hash + "</td>";
      row += "<td>" + description + "</td>";
      row += "<td>" + time + "</td>";
      row += "</tr>";
      table.append(row);
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
  Supply.deployed().then(function (contractInstance) {
    contract_instance = contractInstance;
  });
});
