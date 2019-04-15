const Block = require("./block");

describe('block', ()=>{
    let block, lastBlock, data;
    
    beforeEach(()=>{
        data = 'Hello Unknown';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
        
    });
    
    it('sets the `data` match to input data', ()=>{
        expect(block.data).toEqual(data);
    });
    
    it('sets the `lastHash` match to hash of last block hash', ()=>{
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
    
});