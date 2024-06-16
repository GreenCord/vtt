import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';

/** Class representing the WebSocket server. */
export class Server {
    /**
     * Create the WebSocket server
     * @param {number} port - The port to open for the server connection
     */
    constructor(port = 8888) {
        this.host = http.createServer();
        this.port = port;
        this.ws = new WebSocketServer({ server: this.host });
        this.clients = {};
        this.log = [];
        this.eventTypes = {
            CONNECTED: `connected`,
            DISCONNECTED: `disconnected`,
            USER_EVENT: `userevent`,
        };
    }
    /**
     * Broadcast a message to all connected clients.
     * @param {object} json - JSON object containing info about the message to send
     */
    broadcast(json) {
        console.log(`Broadcasting ::`, json);
        const data = JSON.stringify(json);

        for (let id in this.clients) {
            let client = this.clients[id];

            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        }
    }
    /**
     * Handle closing a client connection by UUID.
     * @param {string} id - Client UUID.
     */
    close(id) {
        console.log(`Closing connection...`);
        this.logEvent({
            id,
            type: this.eventTypes.USER_EVENT,
            message: this.eventTypes.DISCONNECTED
        });
    }
    /**
     * Logs an event to the session log.
     * @param {object} e - An event to log.
     */
    logEvent(e) {
        const { id, type, message } = e;

        console.log(`Logging :: [${id}] :: ${type} /`, message);
        this.log.push(e);
    }
    /**
     * Start the server to listen on requested port.
     */
    listen() {
        this.host.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
    /**
     * Handles receiving a message.
     * @param {object} message - Content of the message received.
     * @param {string} id - UUID of the client responsible for the message.
     */
    message(message, id) {
        console.log(`Handling message...`);
        const data = JSON.parse(message.toString());

        console.log(`data`, data);
        this.logEvent({
            id,
            type: this.eventTypes.USER_EVENT,
            message: JSON.stringify(data),
        });
        if (data && data.command) {
            switch (data.command) {
                case (`getClients`): {
                    const client = this.clients[id];

                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(this.clients));
                    }
                    break;
                }
                case (`chatSendMessage`): {
                    const { msg, user } = data;

                }
                default:
                    break;
            }
        }
    }
    /**
     * Handles opening a WebSocket connection to a client.
     * @param {string} id - UUID of the connecting client.
     */
    open(id) {
        console.log(`Opening...`);
        const event = {
            id,
            type: this.eventTypes.USER_EVENT,
            message: this.eventTypes.CONNECTED
        };

        this.logEvent(event);
        this.broadcast(event);
    }
}