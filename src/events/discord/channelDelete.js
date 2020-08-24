const BaseEvent = require('../../classes/DiscordEvent');
const GuildTickets = require('../../classes/GuildTickets');

module.exports = class extends BaseEvent {
    constructor() {
        super('channelDelete');
    }
    /**
     * 
     * @param {import('discord.js').GuildChannel} channel 
     */
    async run(channel) {
        if (!channel.guild) return;
        const tickets = new GuildTickets(channel.guild.id);
        const ticket = await tickets.find(channel.id);
        if (ticket) await tickets.close(cur.id);
    }
}