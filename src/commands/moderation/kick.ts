import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';

export default class Kick extends Command {
    constructor() {
        super({
            config: {
                name: 'kick',
                description: 'Kick a member from the server!',
                permission: 'Server Moderator',
            },
            options: {
                aliases: [],
                clientPermissions: ['KICK_MEMBERS'],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'kick <User> [...Reason]',
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
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        if (target.equals(message.author)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Hey there, You can\'t kick yourself :P`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        const member = message.guild.member(target.id);
        if (member) {
            if (message.author.id !== message.guild.ownerID && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription('You can\'t kick a member who has a higher or equal to your highest role.')
                );
            }
            if (!member.kickable) {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setDescription('Error: I can\'t kick that member.')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                );
            }
        } else {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`You can't kick a user that is not on this server. ;-;`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        const _reason = reason.length ? reason.join(' ') : 'No reason provided.';
        await member.user.send(new MessageEmbed()
            .setTimestamp()
            .setTitle(`You have been kicked from ${message.guild.name}`)
            .setDescription(`Reason : ${_reason}`)
            .setFooter(`Moderator : ${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
        ).catch(() => { });
        try {
            await member.kick(_reason);
        } catch (e) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Unexpected error occured. Member was not kicked`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        await message.channel.send(`Successfully kick ${target.tag}`);
        const modchannel: any = message.guild.channels.cache.get(settings.modLogChannel);
        if (modchannel && modchannel.type === 'text') {
            await modchannel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Member** : ${target.tag} / ${target.id}\n**Action** : Kick\n**Reason** : ${_reason}`)
            ).catch(() => { });
        }
    }
}