import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed, Role } from 'discord.js';
import Client from '../../classes/Unicron';
import ms from 'ms';
import Guild from '../../classes/Guild';

export default class Mute extends Command {
    constructor() {
        super({
            config: {
                name: 'mute',
                description: 'Mute a member from the server!',
                permission: 'Server Moderator',
            },
            options: {
                aliases: [],
                clientPermissions: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'mute <User> [...Reason]\nmute <User> [Duration] [...Reason]',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[], settings: Guild) {
        const [user, ...reason] = args;
        let target = await client.resolveUser(user);
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
                .setDescription(`Hey there, You mute mute yourself :P`)
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
                    .setDescription('You can\'t mute a member who has a higher or equal to your highest role.')
                );
            }
        } else {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`You can't mute a user that is not on this server. ;-;`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        const duration = reason[0] ? ms(reason[0]) : false;
        if (duration) reason.shift();
        const _reason = reason ? reason.join(' ') : 'No reason provided.';
        let role: Role | void = message.guild.roles.cache.find((r) => { return r.name === 'Muted' });
        if (!role) role = await message.guild.roles.create({ data: { name: 'Muted' } }).catch(() => { });
        try {
            if (role) await member.roles.add(role, _reason)
        } catch (e) {
            return message.channel.send('Member was not muted.');
        }
        for (const channel of message.guild.channels.cache.filter((channel) => channel.type === 'text').array()) {
            if (role && !channel.permissionOverwrites.get(role.id)) {
                await channel.createOverwrite(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                }).catch(() => { });
            }
        }
        await member.user.send(new MessageEmbed()
            .setTimestamp()
            .setTitle(`You have been muted from ${message.guild.name}`)
            .setDescription(`Reason : ${_reason}`)
            .setFooter(`Moderator : ${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
        ).catch(() => { });
        if (duration && !isNaN(duration)) {
            client.setTimeout(() => {
                if (role) member.roles.remove(role, 'Mute Duration expired').catch(() => { });
            }, Number(duration));
        }
        message.channel.send(`Successfully muted **${target.tag}**`);
        const modchannel: any = message.guild.channels.cache.get(settings.modLogChannel);
        if (modchannel && modchannel.type === 'text') {
            modchannel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Member** : ${target.tag} / ${target.id}\n**Action** : Mute\n**Reason** : ${_reason}\n${duration ? `**Length** : ${ms(duration)}` : ''}`)
            ).catch(() => { });
        }
    }
}