const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
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
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async run(client, message, args) {
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
            .addField('Channel Categories', message.guild.channels.cache.filter(channel => channel.type === 'category').size, true)
            .addField('Text Channels', message.guild.channels.cache.filter(channel => channel.type === 'text').size, true)
            .addField('Voice Channels', message.guild.channels.cache.filter(channel => channel.type === 'voice').size, true)
            .addField('Shard ID', message.guild.shardID, true)
            .setTimestamp()
        );
    }
}