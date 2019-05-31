const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet- 
        Balance  : ${this.balance}
        PublicKey: ${this.publicKey.toString()}
        `;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recepient, amount, transactionPool) {
        if (amount > this.balance) {
           console.log(`Amount: ${amount} is greater than your ${this.balance}`);
           return;
       }

       let transaction = transactionPool.existingTransaction(this.publicKey);

       if (transaction)
           transaction.update(this, recepient, amount);
       else{
           transaction = Transaction.newTransaction(this, recepient, amount);
           transactionPool.updateOrAddTransaction(transaction);
       }
        return transaction;
    }
}

module.exports = Wallet;