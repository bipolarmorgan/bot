const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'userinfo',
                description: 'Shows information about a user!',
                permission: 'User',
            },
            options: {
                aliases: ['whois'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: 'userinfo [User]',
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
        let user = await client.resolveUser(args.join(' ')) || message.author;
        if (!user) user = message.author;
        let member = message.guild.member(user);
        if (!member) member = message.member;
        let nick = member.nickname;
        if (!nick) nick = '-';
        let status = user.presence.status;
        switch (status) {
            case 'online': {
                status = `${await client.getEmoji('online')} Online`;
                break;
            }
            case 'idle': {
                status = `${await client.getEmoji('idle')} Idle`;
                break;
            }
            case 'dnd': {
                status = `${await client.getEmoji('dnd')} Do not Disturb`;
                break;
            }
            case 'offline': {
                status = `${await client.getEmoji('offline')} Offline`;
                break;
            }
        }
        let roles = member.roles.cache.map(r => `<@&${r.id}>`).join(', ').replace(new RegExp(`<@&${message.guild.id}>`, 'g'), '');
        if (roles.length === 0) roles = '-';
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addField(`${user.bot ? 'Bot' : 'User'} Info`, `${user.tag} / ${user.id}`)
            .addField(`Joined Server`, member.joinedAt.toUTCString(), true)
            .addField(`Created At`, user.createdAt.toUTCString(), true)
            .addField('\u200b', '\u200b', true)
            .addField(`Status`, status, true)
            .addField(`Nickname`, nick, true)
            .addField(`Roles`, roles)
            .setTimestamp()
        );
    }
}