const express = require('express');
const uuid = require('uuid/v1');
const Blockchain = require('../Blockchain');

const router = express.Router();
const chain = new Blockchain();
const nodeAddress = uuid().replace(/-/g, '');

router.use(express.json());

router.get('/blockchain', (req, res) => {
  res.send(chain);
});

router.post('/transaction', (req, res) => {
  const { amount, sender, recipient } = req.body;
  const blockIndex = chain.createNewTransaction(amount, sender, recipient);

  res.json({
    message: `Transaction will be added in in block ${blockIndex}.`,
  });
});

router.get('/mine', (req, res) => {
  chain.createNewTransaction(1, '00', nodeAddress);

  const lastBlock = chain.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: chain.pendingTransactions,
    index: lastBlock.index + 1,
  };
  const nonce = Blockchain.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = Blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);
  const block = chain.createNewBlock(nonce, previousBlockHash, blockHash);

  res.json({
    message: 'Mined successfully',
    block,
  });
});


module.exports = router;
