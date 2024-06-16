const webSocket = new WebSocket(`ws://localhost:8888`);

// Prototype app constants/states/methods. For dev testing only
const app = {
    commands: {
        ChatSendMessage: { "command": `chatSendMessage` },
        GetClients: { "command": `getClients` },
        HelloWorld: { "command": `helloWorld` },
        valid: [`ChatSendMessage`, `GetClients`, `HelloWorld`],
    },
    content: {
        connection: {
            offline: `&#x25cf; OFFLINE`,
            online: `&#x25cf; ONLINE`,
            unknown: `&#x25cf; UNKNOWN`,
        },
    },
    DOM: {
        status: {
            connection: document.getElementById(`connectionStatus`),
            message: document.getElementById(`statusMessage`),
        }
    },
    status: {
        firstLaunch: true,
        error: false,
    }
};
   // "Toaster" to update interface status message. Abstract to utility/class in future update.
const toast = {
    clear(el) {
        el.textContent = ``;
        this.timeoutID = undefined;
    },
    pop(el, msg) {
        console.log(`Pop a toast!`);
        if (typeof this.timeoutID === `number`) this.cancel();
        el.textContent = msg;
        this.timeoutID = setTimeout(
            (element) => {
                this.clear(element);
            },
            5000,
            el
        );
    },
    write(el, msg) {
        console.log(`Write a message!`);
        if (typeof this.timeoutID === `number`) this.cancel();
        el.textContent = msg;
    },
    cancel() {
        clearTimeout(this.timeoutID);
    },
};

// Event Listening
window.addEventListener(`click`, function (e) {
    const { id } = e.target;

    if (app.commands.valid.includes(id)) {
        e.preventDefault();
        let command = app.commands[id];
        let error = false;

        console.log(`Click! `, id);
        try {
            switch (id) {
                case (`ChatSendMessage`): {
                    command.message = document.getElementById('chatInputField').value
                    command.user = document.getElementById('currentUser').value
                    console.log("Command Updated: ", command)
                    if (!command.user) {
                        toast.pop(app.DOM.status.message, "Login required")
                        error = true;
                        throw Error("NotAuthenticated")
                    }
                    break;
                }
                default:
                    console.log('Not implemented')
            }
        } catch (error) {
            console.log("Error: ", error)
        } finally {
            if (!error) webSocket.send(JSON.stringify(command));
        }
    }
});

// WebSocket Handling
webSocket.onopen = (event) => {
    console.log(webSocket);
    console.log(`webSocket.onopen fired`, event);
    const status = app.DOM.status.connection;

    status.classList.remove(`disconnected`);
    status.classList.remove(`unknown`);
    status.classList.add(`connected`);
    status.innerHTML = app.content.connection.online;
    toast.write(app.DOM.status.message, `Connected!`);

    if (app.status.firstLaunch) {
        console.log(`First launch`);
        webSocket.send(JSON.stringify(app.commands.GetClients));
    }
};

webSocket.onmessage = (event) => {
    console.log(`webSocket.onmessage fired:`, event);
    const data = JSON.parse(event.data);

    console.log(`webSocket.onmessage data`, data);
};

webSocket.onclose = (event) => {
    console.log(`webSocket.onclose fired:`, event);
    const status = app.DOM.status.connection;

    status.classList.add(`disconnected`);
    status.classList.remove(`unknown`);
    status.classList.remove(`connected`);
    status.innerHTML = app.content.connection.offline;
    toast.write(app.DOM.status.message, `Disconnected!`);
};

webSocket.onerror = (event) => {
    console.log(`webSocket.onerror fired`, event);
};