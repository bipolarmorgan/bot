import DiscordEvent from '../../classes/DiscordEvent';
import Client from '../../classes/Unicron';
import { GuildChannel } from 'discord.js';
import GuildTickets from '../../classes/GuildTickets';
import GuildTexts from '../../classes/GuildTexts';

export default class channelDelete extends DiscordEvent {
    constructor() {
        super('channelDelete');
    }
    async run(client: Client, channel: GuildChannel) {
        if (!channel.guild) return;
        const tickets = new GuildTickets(channel.guild.id);
        const ticket = await tickets.find(channel.id);
        if (ticket) await tickets.close(channel.id);
        const texts = new GuildTexts(channel.guild.id);
        const text = await texts.find(channel.id);
        if (text) await texts.close(channel.id);
    }
}