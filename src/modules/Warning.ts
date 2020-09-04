import Client from '../classes/Unicron';
import Guild from '../classes/Guild';
import ms from 'ms';
import { Message, MessageEmbed, GuildMember, Role } from 'discord.js';

export default function (client: Client, message: Message, member: GuildMember, settings: Guild) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await client.db.members.fetch(message.guild.id, member.user.id).catch((e) => { throw e; });
            const maxTreshold = settings.warnThreshold;
            const action = settings.warnThresholdAction;
            const duration = settings.warnActionDuration;
            const warns = db.data.warnings;
            const faction = action.toLowerCase();
            const reason = 'Maximum Warn Threshold Reached!';
            if (maxTreshold === 0 || maxTreshold > warns.length) return resolve(false);
            await member.user.send(new MessageEmbed()
                .setTimestamp()
                .setTitle(`You have been ${faction} from ${message.guild.name}`)
                .setDescription(`Reason : ${reason}`)
                .setFooter(`Moderator : ${client.user.tag} / ${client.user.id}`, client.user.displayAvatarURL({ dynamic: true }))
            ).catch(() => { });
            switch (action) {
                case 'MUTE': {
                    let role: Role | void = message.guild.roles.cache.find((r) => { return r.name === 'Muted' });
                    if (!role) role = await message.guild.roles.create({ data: { name: 'Muted' } }).catch(() => { });
                    if (!role) return resolve(false);
                    await member.roles.add(role, reason).catch(() => { });
                    for (const channel of message.guild.channels.cache.filter((channel) => channel.type === 'text').array()) {
                        if (!channel.permissionOverwrites.get(role.id)) {
                            await channel.createOverwrite(role, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            }).catch(() => { });
                        }
                    }
                    if (duration && !isNaN(duration)) {
                        setTimeout(() => {
                            if (role) member.roles.remove(role, 'Mute Duration expired').catch(() => { });
                        }, Number(duration));
                    }
                    break;
                }
                case 'KICK': {
                    await member.kick(reason).catch(() => { });
                    break;
                }
                case 'SOFTBAN': {
                    await message.guild.members.ban(member.user.id,
                        {
                            days: 7,
                            reason,
                        }
                    ).catch(() => { });
                    setTimeout(() => {
                        message.guild.members.unban(member.user.id).catch(() => { });
                    }, 1000);
                    break;
                }
                case 'BAN': {
                    await message.guild.members.ban(member.user.id,
                        {
                            reason,
                        }
                    ).catch(() => { });
                    if (duration && !isNaN(duration)) {
                        setTimeout(() => {
                            message.guild.members.unban(member.user.id).catch(() => { });
                        }, Number(duration));
                    }
                    break;
                }
                default:
                    return resolve(false);
            }
            const modchannel: any = message.guild.channels.cache.get(settings.modLogChannel);
            if (modchannel && modchannel.type === 'text') {
                modchannel.send(new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${client.user.tag} / ${client.user.id}`, client.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Member** : ${member.user.tag} / ${member.user.id}\n**Action** : ${faction}\n**Reason** : ${reason}\n${duration ? `**Length** : ${ms(duration)}` : ''}`)
                ).catch(() => { });
            }
            return resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}