class Miner{
	constructor(blockchain, transactionPool, wallet, p2pServer){
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pServer = p2pServer;
	}

	mine(){
		const validTransaction = this.transactionPool.validTransaction();
		//include reward for miner
		//clean transaction from local transaction pool
		//broadcast clear transaction from miner transaction pool
	}
}

module.exports = Miner;