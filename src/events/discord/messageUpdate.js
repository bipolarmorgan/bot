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
        if (newMessage.author.bot) return;
        if (newMessage.partial) await newMessage.fetch().catch(() => { });
        client.emit('message', newMessage, false);
    }
}