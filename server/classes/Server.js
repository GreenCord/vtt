const http = require('http');
const { WebSocket, WebSocketServer } = require('ws');


module.exports = class Server {
    constructor(port) {
        this.host = http.createServer();
        this.port = port;
        this.ws = new WebSocketServer({server: this.host})
        this.clients = {};
        this.log = [];
        this.eventTypes = {
            CONNECTED: "connected",
            DISCONNECTED: "disconnected",
            USER_EVENT: "userevent",
        }
    }
    broadcast(json) {
        console.log(`Broadcasting ::`, json);
        const data = JSON.stringify(json);
        for(let id in this.clients) {
            let client = clients[id];
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        }
    } 
    close(id) {
        console.log(`Closing connection...`);
        this.logEvent({ 
            id, 
            type: this.eventTypes.USER_EVENT, 
            message: this.eventTypes.DISCONNECTED});
    }
    logEvent(e) {
        const {id, type, message} = e;
        console.log(`Logging :: [${id}] :: ${type} /`, message);
        this.log.push(e);
    }
    listen() {
        this.host.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`)
        })
    }
    message(message, id) {
        console.log('Handling message...')
        const data = JSON.parse(message.toString());
        console.log('data',data)
        this.logEvent({
            id,
            type: this.eventTypes.USER_EVENT,
            message: JSON.stringify(data),
        })
    }
    open(id) {
        console.log('Opening...')
        this.logEvent({ 
            id, 
            type: this.eventTypes.USER_EVENT, 
            message: this.eventTypes.CONNECTED 
        });
    }
}
