const Server = require('./classes/Server');
const uuidv4 = require('uuid').v4;

require('dotenv').config()

const server = new Server(process.env.SERVER_PORT);
server.listen();
server.ws.on('connection', function(connection) {
    const id = uuidv4();
    server.open(id)
    server.clients[id] = connection;
    connection.on('message', (message) => server.message(message, id));
    connection.on('close', () => server.close(id));
});

