const BaseEvent = require('../../classes/DiscordEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('guildMemberRemove');
    }
    /**
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').GuildMember} member
     */
    async run(client, member) {
        if (member.user.bot) return;
        await client.db.members.delete(member.guild.id, member.user.id).catch(console.log);
        const guild = await client.db.guilds.fetch(member.guild.id).catch(console.log);
        const channel_id = guild.farewellChannel;
        const message = guild.farewellMessage;
        const enabled = guild.farewellEnabled;
        if (!channel_id || !enabled || !message) return;
        const channel = await client.channels.fetch(channel_id).catch(() => { });
        if (!channel || channel.type !== 'text') return;
        channel.send(message
            .replace('{user}', member.user.tag)
            .replace(/@everyone/g, '@' + String.fromCharCode(8203) + 'everyone')
            .replace(/@here/g, '@' + String.fromCharCode(8203) + 'here')
        ).catch(() => { });
    }
}