const BaseEvent = require('../../classes/DiscordEvent');
const GuildTickets = require('../../classes/GuildTickets');
const GuildTexts = require('../../classes/GuildTexts');

module.exports = class extends BaseEvent {
    constructor() {
        super('channelDelete');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').GuildChannel} channel 
     */
    async run(client, channel) {
        if (!channel.guild) return;
        const tickets = new GuildTickets(channel.guild.id);
        const ticket = await tickets.find(channel.id);
        if (ticket) await tickets.close(channel.id);
        const texts = new GuildTexts(channel.guild.id);
        const text = await texts.find(channel.id);
        if (text) await texts.close(channel.id);
    }
}