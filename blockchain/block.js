const SHA256 = require('crypto-js/sha256');

class Block
{
    constructor(timestamp, lastHash, hash, data){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
    
    toString(){
        return `Block -
        Time Stamp: ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0, 10)}
        Hash      : ${this.hash.substring(0, 10)}
        Data      : ${this.data}
        `;
    }
    
    static genesis() {
        return new this('Some thing', '------', 'f1r57 ha5h', []);
    }
    
    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        const timestamp = Date.now();
        const hash = Block.hash(timestamp, lastHash, data);
        
        return new this(timestamp, lastHash, hash, data);
    }
    
    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    genHash(block) {
        const {timestamp, data, lastHash} = block;
        return Block.hash(timestamp, lastHash, data);
    }
}

module.exports = Block;