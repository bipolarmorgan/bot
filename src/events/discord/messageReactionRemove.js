const { MessageEmbed } = require('discord.js');
const BaseEvent = require('../../classes/DiscordEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('messageReactionRemove');
    }
    /**
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').MessageReaction} reaction
     * @param {import('discord.js').User} user
     */
    async run(client, reaction, user) {
        try {
            if (reaction.partial) await reaction.fetch().catch(() => { });
            if (user.bot) return;
            if (!reaction.message.guild) return;
            const guild = await client.db.guilds.fetch(reaction.message.guild.id).catch(console.log);
            const isReact = guild.verificationType;
            const channel_id = guild.verificationChannel;
            const status = guild.verificationEnabled;
            const role = guild.verificationRole;
            if (!role
                || !status
                || (channel_id !== reaction.message.channel.id)
                || (isReact !== 'react')
                || reaction.emoji.name !== 'yes'
                || !reaction.message.guild.me.permissions.has(['MANAGE_ROLES'])
            ) return;
            const member = await reaction.message.guild.members.fetch(user.id).catch(() => { });
            if (member) {
                await member.roles.remove(role).catch(() => {});
                reaction.message.channel.send(new MessageEmbed()
                    .setColor(0x00FF00)
                    .setTimestamp()
                    .setDescription(`You have been unverified <@${user.id}>`)
                ).then(async m => {
                    m.delete({ timeout: 5000 }).catch(() => {});
                }).catch(() => { });
            }
        } catch (e) {
            client.logger.error(e);
        }
    }
}