import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed, PresenceStatus } from 'discord.js';
import Client from '../../classes/Unicron';

export default class UserInfo extends Command {
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
    async run(client: Client, message: Message, args: string[]) {
        let user = await client.resolveUser(args.join(' ')) || message.author;
        if (!user) user = message.author;
        let member = message.guild.member(user);
        let nick = member.nickname;
        if (!nick) nick = '-';
        let status: PresenceStatus | string = user.presence.status;
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
        let roles = member.roles.cache
            .filter((r) => r.name !== '@everyone')
            .sort((a, b) => b.position - a.position)
            .map(r => `<@&${r.id}>`).join(', ');
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
            .addField(`Roles`, client.shorten(roles, 1024))
        );
    }
}