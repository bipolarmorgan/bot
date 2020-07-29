
const Event = require('../classes/BaseEvent');

module.exports = class extends Event {
    constructor() {
        super('messageUpdate');
    }
    /**
     * @param {import('../classes/Unicron')} client 
     * @param {import('discord.js').Message} oldMessage 
     * @param {import('discord.js').Message} newMessage
     */
    async run(client, oldMessage, newMessage) {
        if (newMessage.partial) await newMessage.fetch();
        client.emit('message', newMessage, false);
    }
}