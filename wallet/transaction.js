const ChainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.output = [];
    }

    static  newTransaction(senderWallet, recepient, amount) {
        const transaction = new this();

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} is greater than your balance`);
            return;
        }

        transaction.output.push(...[
            { balance: senderWallet-amount, address: senderWallet.publicKey}
            { amount, address: recepient}
        ]);

        return transaction;
    }
}

module.exports = Transaction;