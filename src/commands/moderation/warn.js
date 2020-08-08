const ms = require('ms');
const Warning = require('../../modules/Warning');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'warn',
                description: 'Warns the specified user. If warning threshold reaches for a user some action, specified by the `warnTresholdAction` configuration, is taken. This command requires kick_members, ban_members, manage_roles, manage_channels permission(s) for the `warnTresholdAction` to work so the bot may have it or not',
                permission: 'Server Moderator',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'warn <User> [...Reason]\nwarn <User> [Duration] [...Reason]',
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
     * @param {import('../../classes/Guild')} guildSettings
     */
    async run(client, message, args, guildSettings) {
        const [user, ...reason] = args;
        const target = await client.resolveUser(user);
        if (!target || target.bot) {
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
                .setDescription(`Hey there, You can't warn yourself :P`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        const member = message.guild.member(target);
        if (member) {
            if (message.author.id !== message.guild.ownerID && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription('You can\'t warn a member who has a higher or equal to your highest role.')
                );
            }
        } else {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`You can't warn a user that is not on this server.`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
        const duration = reason[0] ? ms(reason[0]) : false;
        if (duration) reason.shift();
        const _reason = reason ? reason.join(' ') : 'No reason provided.';
        /**
         * @type {import('../../classes/Member')}
         */
        const instance = await client.db.members.fetch(message.guild.id, member.user.id).catch(console.log);
        const index = instance.addWarn(_reason, message.author);
        if (duration && !isNaN(duration)) {
            setTimeout(() => {
                instance.removeWarn(index);
                instance.save().catch(console.log);
            }, Number(duration));
        }
        await instance.save().catch((e) => { throw e; });
        await message.channel.send(`Successfully warned ${target}`);
        const modChannel = await client.channels.fetch(guildSettings.modLogChannel).catch(() => { });
        if (modChannel) {
            modChannel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setThumbnail(target.displayAvatarURL({ dynamic: true }) || null)
                .setDescription(`**Member** : ${target.tag} / ${target.id}\n**Action** : Warn\n**Reason** : ${_reason}\n${duration ? `**Length** : ${ms(duration)}` : ''}`)
            );
        }
        const dm = await target.createDM();
        await dm.send(new MessageEmbed()
            .setTimestamp()
            .setTitle(`You have been warned from ${message.guild.name}`)
            .setDescription(`Reason : ${_reason}`)
            .setFooter(`Moderator : ${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
        ).catch(() => { });
        await Warning(client, message, member, guildSettings).catch((e) => { throw e; });
    }
}