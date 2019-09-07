const express = require('express');
const router = express.Router();
const Blockchain = require('../../blockchain');
const bc = new Blockchain();

const P2pServer = require('./p2p-server');
const Blockchain = require('../blockchain');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/block', (req, res)=>{
	//console.log(bc.chain);
	res.json(bc.chain);
});

router.get('/transaction', (req, res)=>{
	res.json(tp.transactions);
});

router.get('/mine-transactions', (req, res)=>{
	const block = miner.mine();
	console.log(`New block added: ${block}`);
	res.status(302).redirect('/block');
});

router.get('/public-key', (req, res)=>{
	res.json({publicKey: wallet.publicKey});
});

router.get('/balance', (req, res)=>{
    const balance = wallet.calculateBalance(bc);
    res.json({'Balance' : balance});
});

router.post('/transact', (req, res)=>{
	const { recipient, amount } = req.body;
	const transaction = wallet.createTransaction(recipient, amount, bc, tp);
	//console.log(tp, transaction);
	p2pServer.broadcastTransaction(transaction);
	res.status(302).redirect('/transaction');
});

router.post('/mine', (req, res)=>{
	//console.log(data);
	const nwBlock = bc.addBlock(req.body.data);
	console.log(`New block added  ${nwBlock.toString()}`);
	p2pServer.syncChain();
	res.status(302).redirect('/block');
});

p2pServer.listen();
module.exports = router;