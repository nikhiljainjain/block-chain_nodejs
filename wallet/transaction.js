const ChainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.output = [];
    }

    update(senderWallet, recepient, amount) {
        let senderOutput = this.output.find(output => output.address === senderWallet.publicKey);

        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} is greater than your balance`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.output.push({amount, address: recepient});
        Transaction.verifyTransaction(this, senderWallet);

        return this;
    }

    static  newTransaction(senderWallet, recepient, amount) {
        const transaction = new this();

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} is greater than your balance`);
            return;
        }

        transaction.output.push(...[
            { amount: senderWallet.balance-amount, address: senderWallet.publicKey},
            { amount, address: recepient}
        ]);

        Transaction.signTranscation(transaction, senderWallet);

        return transaction;
    }

    static signTranscation(transaction, senderWallet) {
        transaction.input = {
            timeStamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.output))
        };
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.output)
        );
    }
}

module.exports = Transaction;