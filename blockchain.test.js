const Block = require('./block');
const Blockchain = require('./blockchain');

describe('Blockchain', ()=>{
    let bc;
    
    beforeEach(()=>{
        bc = new Blockchain();
    });
    
    it('Checking genesis block', ()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    });
    
    it('Adding new block to the chain', ()=>{
        let data = "Unknown";
        bc.addBlock(data);
        
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });
});