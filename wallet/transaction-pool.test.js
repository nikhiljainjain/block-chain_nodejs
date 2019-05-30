const TransactionPool= require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', ()=>{
    let wallet, transaction, tp;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new tp();
        transaction = new Transaction();
        transaction = Transaction.newTransaction(wallet, 'unknown', 37);
        tp.updateOrAddTransaction(transaction);
    });

    it('adding transaction to the pool', ()=>{
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('checking for transaction pool get updated', ()=>{
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'virus', 51);
        tp.updateOrAddTransaction(newTransaction);
        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
            .not.toEqual(oldTransaction);
    });
});