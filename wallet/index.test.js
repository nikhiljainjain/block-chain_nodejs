const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', ()=>{
    let wallet, tp;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('doing the transaction', ()=>{
        let recepient, sendAmount, transaction;

        beforeEach(()=>{
            recepient = "r4nd0m-4ddr3ss";
            sendAmount = 51;
            transaction = wallet.createTransaction(recepient, sendAmount, tp);
        });

        describe('doing the same transaction again', ()=>{

            beforeEach(()=>{
                transaction.update(wallet, recepient, sendAmount);
            });

            it('double of `sendAmount` dedicated from sender wallet', ()=>{
                expect(transaction.output.find(o => o.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2);
            });

            it('double of `sendAmount` send to recepient', ()=>{
                expect(transaction.output.filter(o => o.address === recepient)
                    .map(output => output.amount))
                    .toEqual([sendAmount, sendAmount]);
            });

        });

    });

});