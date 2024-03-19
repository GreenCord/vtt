import { v4 as uuidv4 } from 'uuid';

/** Class to initialize the Chat */
export class ChatHandler {
    /**
     * Creates a handler for managing chat sessions.
     */
    constructor() {
        this.activeChat = undefined;
        this.allChats = [];
    }
    /**
     * Creates a chat session.
     * @param {object} users - Array of users associated with the chat session.
     */
    createChat(users) {
        console.log(`Create a chat that includes users/${users}`);
        const id = uuidv4();

        this.allChats.push(id);
    }
    /**
     * Gets a chat session.
     * @param {string} id - UUID of chat session to retrieve
     */
    getChat(id) {
        console.log(`Retrieve a chat by id :: ${id}`);
    }
    /**
     * Updates a chat session with a message.
     * @param {string} id - UUID of chat session to update
     * @param {object} message - message.userid, message.text
     */
    updateChat(id, message) {
        console.log(`Update a chat with a message :: id/${id} :: message/${message}`);
    }
    /**
     * Deletes a chat session.
     * @param {string} id - UUID of chat session to delete.
     */
    deleteChat(id) {
        console.log(`Delete a chat by id/${id}`);
    }
}
