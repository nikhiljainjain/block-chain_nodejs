const express = require('express');
const router = express.Router();
const Blockchain = require('../../blockchain');
const bc = new Blockchain();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/block', (req, res, next)=>{
  res.json(bc.chain);
});

router.post('/mine', (req, res, next)=>{
  const nwBlock = bc.addBlock(req.body.data);
  console.log(`New block added  ${nwBlock.toString()}`);

  res.redirect('/block');
});

module.exports = router;
