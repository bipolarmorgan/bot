
const BaseEvent = require('../classes/BaseEvent');

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
        setTimeout(() => client.destroy().then(() => client.login(process.env.BOT_TOKEN)), 10000);
        client.logger.error(`[DISCONNECT] Notice: Disconnected from gateway with code ${event.code} - Attempting reconnect.`);
    }
}