const { MessageEmbed } = require('discord.js');
const ms = require('ms');

/**
 * 
 * @param {import('../classes/Unicron')} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @param {import('../classes/Guild')} settings
 * 
 */
module.exports = (client, message, member, settings) => {
    return new Promise(async (resolve, reject) => {
        try {
            const strat = settings.autoModeration;
            const act = settings.autoModAction;
            const action = act.toLowerCase();
            if (!strat) return resolve(false);
            const duration = settings.autoModDuration;
            const reason = 'Auto Moderation';
            const dm = await member.user.createDM();
            await dm.send(new MessageEmbed()
                .setTimestamp()
                .setTitle(`You have been ${action} from ${message.guild.name}`)
                .setDescription(`Reason : ${reason}`)
                .setFooter(`Moderator : ${client.user.tag} / ${client.user.id}`, client.user.displayAvatarURL({ dynamic: true }))
            ).catch(() => { });
            switch (act) {
                case 'MUTE': {
                    let role = message.guild.roles.cache.find((r) => { return r.name === 'Muted' });
                    if (!role) role = await message.guild.roles.create({ name: 'Muted' }).catch(() => { });
                    if (!role) return resolve(false);
                    await member.roles.add(role, reason).catch(() => { });
                    for (let channel of message.guild.channels.cache.filter(channel => channel.type === 'text')) {
                        channel = channel[1];
                        if (!channel.permissionOverwrites.get(role.id)) {
                            await channel.createOverwrite(role, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            }).catch(() => { });
                        }
                    }
                    if (duration && !isNaN(duration)) {
                        setTimeout(() => {
                            member.roles.remove(role, 'Mute Duration expired').catch(() => { });
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
            const modchannel = await client.channels.fetch(settings.modLogChannel).catch(() => { });
            if (modchannel && modchannel.type === 'text') {
                modchannel.send(new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${client.user.tag} / ${client.user.id}`, client.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Member** : ${message.author.tag} / ${message.author.id}\n**Action** : ${action}\n**Reason** : ${reason}\n${duration ? `**Length** : ${ms(duration)}` : ''}`)
                ).catch(() => { });
            }
            return resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}