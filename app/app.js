var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

const P2pServer = require('./p2p-server');
const Blockchain = require('../blockchain');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const HTTP_PORT = process.env.HTTP_PORT || 3001;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/block', (req, res)=>{
  //console.log(bc.chain);
  res.json(bc.chain);
});

app.post('/mine', (req, res)=>{
  const nwBlock = bc.addBlock(req.body.data);
  console.log(`New block added  ${nwBlock.toString()}`);
  p2pServer.syncChain();
  res.status(302).redirect('/block');
});

app.get('/transaction', (req, res)=>{
  res.json(tp.transactions);
});

app.post('/transact', (req, res)=>{
  const { recepient, amount } = req.body;
  const transaction = wallet.createTransaction(recepient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  res.status(302).redirect('/transaction');
});

app.get('/public-key', (req, res)=>{
  res.json({publicKey: wallet.publicKey});
});

/*app.use('/', indexRouter);
app.use('/users', usersRouter);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(HTTP_PORT, () => console.log(`Listening on Port ${HTTP_PORT}`));
p2pServer.listen();
module.exports = app;