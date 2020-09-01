import DiscordEvent from '../../classes/DiscordEvent';
import Client from '../../classes/Unicron';
import { Guild } from 'discord.js';

export default class guildDelete extends DiscordEvent {
    constructor() {
        super('guildDelete');
    }
    async run(client: Client, guild: Guild) {
        const channel: any = await client.channels.fetch(client.unicron.channel);
        channel.send(`Unicron left \`${guild.name}\` / \`${guild.id}\``);
        client.shard.broadcastEval(`
            this.user.setPresence({
                activity: {
                    name: \`${await client.getCount('guilds')} guilds! | -help\`,
                    type: 'LISTENING',
                },
                status: 'online',
            });
        `);
        client.db.guilds.delete(guild.id).catch(console.log);
    }
}