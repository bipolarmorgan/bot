const { MessageEmbed } = require('discord.js');
const BaseEvent = require('../../classes/DiscordEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('messageReactionAdd');
    }
    /**
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').MessageReaction} reaction
     * @param {import('discord.js').User} user
     */
    async run(client, reaction, user) {
        try {
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            let guild = await client.db.guilds.fetch(reaction.message.guild.id).catch(console.log);
            if (!guild) guild = await client.db.guilds.fetch(reaction.message.guild.id).catch(console.log);
            const isReact = guild.verificationType;
            const channel_id = guild.verificationChannel;
            const status = guild.verificationEnabled;
            const role = guild.verificationRole;
            if (!role
                || !status
                || (channel_id !== reaction.message.channel.id)
                || (isReact !== 'react')
                || (reaction.emoji.name !== 'yes')
                || !reaction.message.guild.me.permissions.has(['MANAGE_ROLES'])
            ) return;
            const member = await reaction.message.guild.members.fetch(user.id).catch(() => { });
            if (member) {
                await member.roles.add(role).catch(() => { });
                reaction.message.channel.send(new MessageEmbed()
                    .setColor(0x00FF00)
                    .setTimestamp()
                    .setDescription(`You have been verified <@${user.id}>`)
                ).then(async (m) => {
                    m.delete({ timeout: 5000 }).catch(() => { });
                });
            }
        } catch (e) {
            client.logger.error(e);
        }
    }
}