import Client from '../../classes/Unicron';
import { Message } from 'discord.js';
import DiscordEvent from '../../classes/DiscordEvent';
import inviteFilter from '../../filters/inviteFilter';
import mentionSpamFilter from '../../filters/mentionSpamFilter';
import swearFilter from '../../filters/swearFilter';
import Guild from '../../classes/Guild';

export default class messageUpdate extends DiscordEvent {
    constructor() {
        super('messageUpdate');
    }
    async run(client: Client, _oldMessage: Message, message: Message) {
        if (message.partial) await message.fetch().catch(() => { });
        if (!message) return;
        const guildSettings: Guild | void = await client.db.guilds.fetch(message.guild.id).catch(console.log);
        if (!guildSettings) return;
        if (await swearFilter(client, message, guildSettings)) return;
        if (await inviteFilter(client, message, guildSettings)) return;
        if (await mentionSpamFilter(client, message, guildSettings)) return;
    }
}