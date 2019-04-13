const sha256 = require('sha256');

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];

    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  createNewTransaction(amount, sender, recipient) {
    const newTransaction = {
      amount,
      sender,
      recipient,
    };

    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock().index + 1;
  }

  static hashBlock(previousBlockHash, currentBlockData, nonce) {
    const data = `${previousBlockHash}${nonce}${JSON.stringify(currentBlockData)}`;
    return sha256(data);
  }

  static proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = Blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);

    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = Blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }
}

module.exports = Blockchain;
