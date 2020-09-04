import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import ms from 'ms';
import Guild from '../../classes/Guild';

export default class Ban extends Command {
    constructor() {
        super({
            config: {
                name: 'ban',
                description: 'Ban a member from the server!',
                permission: 'Server Moderator',
            },
            options: {
                aliases: [],
                clientPermissions: ['BAN_MEMBERS'],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'ban <User> [...Reason]\nban <User> [Duration] [...Reason]',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[], settings: Guild) {
        const [user, ...reason] = args;
        const target = await client.resolveUser(user);
        if (!target) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Incorrect Usage, the correct usages are:\n\`${this.options.usage}\``)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        if (target.equals(message.author)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Hey there, You can't ban yourself :P`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        const member = message.guild.member(target.id);
        if (member) {
            if (message.author.id !== message.guild.ownerID && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription('You can\'t ban a member who has a higher or equal to your highest role.')
                );
            }
            if (!member.bannable) {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setDescription('Error: I can\'t ban that member.')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                );
            }
        } else {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`You can't ban a user that is not on this server. ;-;`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        const duration = reason[0] ? ms(reason[0]) : false;
        if (duration) reason.shift();
        const _reason = reason.length ? reason.join(' ') : 'No reason provided.';
        await member.user.send(new MessageEmbed()
            .setTimestamp()
            .setTitle(`You have been banned from ${message.guild.name} / ${message.guild.id}`)
            .setDescription(`Reason : ${_reason}`)
            .setFooter(`Moderator : ${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
        ).catch(() => { });
        try {
            await message.guild.members.ban(member.user.id, { days: 7, reason: _reason, });
        } catch (e) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Unexpected error occured. Member was not banned`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        if (duration && !isNaN(duration)) {
            client.setTimeout(() => {
                message.guild.members.unban(target.id, 'Duration expired').catch(() => { });
            }, Number(duration));
        }
        message.channel.send(`Successfully banned **${target.tag}**`);
        const modchannel: any = message.guild.channels.cache.get(settings.modLogChannel);
        if (modchannel && modchannel.type === 'text') {
            modchannel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Member** : ${target.tag} / ${target.id}\n**Action** : Ban\n**Reason** : ${_reason}\n${duration ? `**Length** : ${ms(duration)}` : ''}`)
            ).catch(() => { });
        }
    }
}