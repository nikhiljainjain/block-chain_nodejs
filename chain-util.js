const EC = require('elliptic').ec;
const ec = EC('secp256k1');
const uuidV1 = require('uuid/v1');

class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    get id() {
        return uuidV1();
    }
}

module.exports = ChainUtil;