const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
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
        this.sendMsg(socket);
    }

    sendMsg(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    messageHandler(socket) {
        socket.on('message', msg => {
            const data = JSON.parse(msg);
            this.blockchain.replaceChain(data);
        });
    }

    syncChain() {
        this.sockets.forEach(socket => {
            this.sendMsg(socket);
        });
    }
}

module.exports = P2pServer;