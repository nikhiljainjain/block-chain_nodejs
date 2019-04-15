const Block = require("./block");

class Blockchain 
{
    constructor(){
        this.chain = [Block.genesis()];
    }
    
    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length -1], data);
        this.chain.push(block);
        
        return block;
    }

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(this.chain[0])) return false;

        for (let i=1;i<chain.length;i++){
            const block = chain[i];
            const lastBlock = chain[i-1];

            if (block.lastHash !== lastBlock.hash || block.hash !== block.genHash(block)) return false;
        }

        return true;
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.log('Given chain length is not greater than existing chain');
            return;
        }else if (!this.isValidChain(chain)) {
            console.log('Given chain is invalid for replacing');
            return;
        }

        console.log('Chain is replaced');
        this.chain = chain;
    }
}

module.exports = Blockchain;