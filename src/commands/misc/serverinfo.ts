import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';

export default class ServerInfo extends Command {
    constructor() {
        super({
            config: {
                name: 'serverinfo',
                description: 'Shows this server\'s information.',
                permission: 'User',
            },
            options: {
                aliases: ['guildinfo'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: 'serverinfo',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`${message.guild.name} / ${message.guild.id}`)
            .setImage(message.guild.splash ? message.guild.splashURL() : null)
            .setThumbnail(message.guild.icon ? message.guild.iconURL() : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(message.guild.nameAcronym)}`)
            .addField('Owner', `${message.guild.owner.user.tag} / ${message.guild.ownerID}`)
            .addField('Created At', message.guild.createdAt.toUTCString())
            .addField('Region', message.guild.region.toUpperCase(), true)
            .addField('Members', message.guild.memberCount, true)
            .addField('Emojis', message.guild.emojis.cache.size, true)
            .addField('Category Channels', message.guild.channels.cache.filter(channel => channel.type === 'category').size, true)
            .addField('Text Channels', message.guild.channels.cache.filter(channel => channel.type === 'text').size, true)
            .addField('Voice Channels', message.guild.channels.cache.filter(channel => channel.type === 'voice').size, true)
            .addField('Shard ID', message.guild.shardID, true)
            .setTimestamp()
        );
    }
}