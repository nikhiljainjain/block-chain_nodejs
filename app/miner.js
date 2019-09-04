const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner{
	constructor(blockchain, transactionPool, wallet, p2pServer){
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pServer = p2pServer;
	}

	mine(){
		const validTransactions = this.transactionPool.validTransaction();
		//include a reward for the miner
		validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
		//create a block consisting of the valid transactions
		const block = this.blockchain.addBlock(validTransactions);
		//synchronize the chains  in the peer-to-peer server
		this.p2pServer.syncChain();
		//clear the local transaction pool
		this.transactionPool.clear();
		//broadcast to every minver to clear their transaction pools
		this.p2pServer.broadcastClearTransaction();

		return block;
	}
}

module.exports = Miner;