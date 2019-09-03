const Transaction = require("../wallet/transaction"); 

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        const transactionWithId = this.transactions.find(t => t.id === transaction.id);

        if (transactionWithId)
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        else
            this.transactions.push(transaction);
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

    validTransaction(){
        return this.transactions.filter(t => {
            
            const outputTotal = t.output.reduce((total, output)=>{
                return total + output.amount;
            }, 0);

            if (t.input.amount  !== outputTotal){
                console.log(`Invalid transaction from ${t.input.address} address.`);
                return;
            }

            if (!Transaction.verifyTransaction(t)){
                console.log(`Invalid transaction from ${t.input.address} address.`);
                return;
            }

            return t;
        });
    }
}

module.exports = TransactionPool;