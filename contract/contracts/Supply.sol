pragma solidity ^0.4.2;

contract Supply {
	struct part {
		string partName;
		bytes currentOwner;
	}

	struct transaction {
		bytes32[] transactions;
	}

	bytes[] users;
	address contractOwner;
	mapping(uint => part) pool;
	mapping(uint => transaction) history;
	uint[] serials;

	function Supply() {
		contractOwner = msg.sender;
		// Create some parts owned by the pool (contract owner)
		string memory name1 = 'wheel';
		string memory name2 = 'controller';

		uint serial1 = 1;
		uint serial2 = 2;
		uint serial3 = 3;
		uint serial4 = 4;
		
		string memory original = "pool";
		bytes memory owner = bytes(original);
		part memory part1 = part({
			partName: name1, 
			currentOwner: owner});
		part memory part2 = part({
			partName: name1, 
			currentOwner: owner});
		part memory part3 = part({
			partName: name2, 
			currentOwner: owner});
		part memory part4 = part({
			partName: name2, 
			currentOwner: owner});

		pool[serial1] = part1;
		pool[serial2] = part2;
		pool[serial3] = part3;
		pool[serial4] = part4;
		serials.push(serial1);
		serials.push(serial2);
		serials.push(serial3);
		serials.push(serial4);

	}

	function transferOwnership(string _from, string _to, uint partSerial) public {
		part partToTransfer = pool[partSerial];
		// check if the part exists
		if (partToTransfer.currentOwner.length != 0) {
			if (!(bytesCompare(pool[partSerial].currentOwner, bytes(_from)))) throw;
			pool[partSerial].currentOwner = bytes(_to);
		}
	}

	function storeTransaction(uint partSerial, bytes32 value) public {
		history[partSerial].transactions.push(value);
	}

	function getTransaction(uint partSerial) public constant returns (bytes32[]) {
		return history[partSerial].transactions;
	}

	function bytesCompare(bytes storage a, bytes memory b) internal returns (bool) {
		if (a.length != b.length)
			return false;
		// @todo unroll this loop
		for (uint i = 0; i < a.length; i ++)
			if (a[i] != b[i])
				return false;
		return true;
	}
	// function stringsEqual(string _a, string _b) internal returns (bool) {
	// 	bytes a = bytes(_a);
	// 	bytes b = bytes(_b);
	// 	if (a.length != b.length)
	// 		return false;
	// 	// @todo unroll this loop
	// 	for (uint i = 0; i < a.length; i ++)
	// 		if (a[i] != b[i])
	// 			return false;
	// 	return true;
	// }

	function getAllParts() public constant returns (uint[]){
		return serials;
	}

	function getPart(uint serial) public constant returns (bytes, bytes) {
		bytes name = bytes(pool[serial].partName);
		bytes owner = pool[serial].currentOwner;
		return (name, owner);
	}
}
