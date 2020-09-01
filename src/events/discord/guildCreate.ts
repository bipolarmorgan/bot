import DiscordEvent from '../../classes/DiscordEvent';
import Client from '../../classes/Unicron';
import { Guild, MessageEmbed } from 'discord.js';

export default class guildCreate extends DiscordEvent {
    constructor() {
        super('guildCreate');
    }
    async run(client: Client, guild: Guild) {
        const channel: any = await client.channels.fetch(client.unicron.channel);
        channel.send(new MessageEmbed()
            .setTitle(`${guild.name} has invited Unicron`)
            .setColor('RANDOM')
            .setAuthor(`${guild.name} / ${guild.id}`)
            .setImage(guild.splash ? guild.splashURL() : null)
            .setThumbnail(guild.icon ? guild.iconURL() : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(guild.nameAcronym)}`)
            .addField('Owner', `${guild.owner.user.tag} / ${guild.ownerID}`)
            .addField('Created At', guild.createdAt.toUTCString())
            .addField('Region', guild.region.toUpperCase(), true)
            .addField('Members', guild.memberCount, true)
            .addField('Emojis', guild.emojis.cache.size, true)
            .addField('Channel Categories', guild.channels.cache.filter(channel => channel.type === 'category').size, true)
            .addField('Text Channels', guild.channels.cache.filter(channel => channel.type === 'text').size, true)
            .addField('Voice Channels', guild.channels.cache.filter(channel => channel.type === 'voice').size, true)
            .setTimestamp()
        );
        client.shard.broadcastEval(`
            this.user.setPresence({
                activity: {
                    name: \`${await client.getCount('guilds')} guilds! | -help\`,
                    type: 'LISTENING',
                },
                status: 'online',
            });
        `);
        await client.db.guilds.fetch(guild.id).catch(console.log);
    }
}