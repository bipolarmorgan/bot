const Event = require('../../classes/DiscordEvent');

module.exports = class extends Event {
    constructor() {
        super('messageUpdate');
    }
    /**
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} oldMessage 
     * @param {import('discord.js').Message} newMessage
     */
    async run(client, oldMessage, newMessage) {
        if (newMessage.partial) await newMessage.fetch().catch((e) => { return; });
        client.emit('message', newMessage, false);
    }
}