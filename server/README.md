# ChickenVTT WebSocket Server

## Prerequisites

* (Optional) Install a Node Version Manager.
* Install the correct NodeJS version indicated in the `/server/.nvmrc` file.

## Setup

1. In a terminal, go to the root `/` directory.
1. Make sure you use the required version of Node:
    1. If using Node Version Manager: type `nvm use` and hit enter.
    1. Otherwise, make sure your current node version matches the version listed in the `./.nvmrc` file.
1. Install the Node Packages: `npm install`
1. Go to the `/server` directory.
1. Create a `.env` file in the `/server` directory, and add `SERVER_PORT=` and your desired port, e.g. `SERVER_PORT=8888`.
1. To run the server in a terminal: `node server.js`