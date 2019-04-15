const block = require("./blockchain/block");
const Block = new block('89762', 'lkasjdf', 'asdljf', 'something');

console.log(Block.toString());
console.log(block.genesis().toString());
console.log(block.mineBlock(Block, 'Hello').toString());