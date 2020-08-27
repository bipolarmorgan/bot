
const BaseEvent = require('../../classes/DiscordEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('disconnect');
    }
    /**
     * 
     * @param {import('../classes/Unicron')} client 
     * @param {import('discord.js').CloseEvent} event 
     */
    async run(client, event) {
        setTimeout(() => client.destroy().then(() => client.login(process.env.DISCORD_TOKEN)), 10000);
        client.logger.error(`[DISCONNECT] Notice: Disconnected from gateway with code ${event.code} - Attempting reconnect.`);
    }
}