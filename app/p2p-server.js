const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPE = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
};

class P2pServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeer();
        console.log(`Listen for P2P connection on port ${P2P_PORT}`);
    }

    connectToPeer() {
        peers.forEach(peer =>{
            const socket = new WebSocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Connection established');

        this.messageHandler(socket);
        this.sendChain(socket);
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPE.chain,
            chain: this.blockchain.chain
        }));
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPE.transaction,
            transaction
        }));
    }

    messageHandler(socket) {
        socket.on('message', msg => {
            const data = JSON.parse(msg);
            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPE.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transactiona);
                    break;
            }
        });
    }

    syncChain() {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        });
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction);
        });
    }
}

module.exports = P2pServer;