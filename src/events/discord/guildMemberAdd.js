const { MessageEmbed } = require('discord.js');
const BaseEvent = require('../../classes/DiscordEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('guildMemberAdd');
    }
    /**
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').GuildMember} member
     */
    async run(client, member) {
        if (member.user.bot) return;
        const guild = await client.db.guilds.fetch(member.guild.id).catch(console.log);
        const verifier = guild.verificationType;
        if (['discrim', 'captcha'].includes(verifier)) {
            const enabled = guild.verificationEnabled;
            const channel = guild.verificationChannel;
            const role = guild.verificationRole;
            const vChannel = member.guild.channels.cache.get(channel);
            const vRole = member.guild.roles.cache.get(role);
            if (enabled && channel && role && vChannel && vRole) {
                const memberStats = await client.db.members.fetch(member.guild.id, member.user.id).catch(console.log);
                if (!memberStats.data) memberStats.data = {};
                memberStats.data.captcha = client.utils.Random.string(8);
                await memberStats.save().catch(console.log);
                const dm = await member.user.createDM().catch(() => { });
                switch (verifier) {
                    case 'discrim': {
                        await dm.send(new MessageEmbed()
                            .setTimestamp()
                            .setColor(0xD3D3D3)
                            .setTitle(`Welcome to ${member.guild.name}`)
                            .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`This server is protected by [Unicron](${client.unicron.serverInviteURL} 'Unicron's Support Server'), a powerful bot that prevents servers from being raided\nTo get yourself verified use \`I am ${member.user.discriminator}\` at <@#${channel}>.`)
                        ).catch(() => { });
                        break;
                    }
                    case 'captcha': {
                        await dm.send(new MessageEmbed()
                            .setTimestamp()
                            .setColor(0xD3D3D3)
                            .setTitle(`Welcome to ${member.guild.name}`)
                            .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`This server is protected by [Unicron](${client.unicron.serverInviteURL} 'Unicron's Support Server'), a powerful bot that prevents servers from being raided\nTo get yourself verified use \`>verify ${memberStats.data.captcha}\` at <@#${channel}>.`)
                        ).catch(() => { });
                        break;
                    }
                }
                setTimeout(async () => {
                    await member.fetch().catch(() => { });
                    if (!member.roles.cache.has(role) && member.kickable) await member.kick('Did not verified in 10 mins').catch(() => { });
                }, 60000 * 10);
            }
        }
        const channel_id = guild.welcomeChannel;
        const message = guild.welcomeMessage;
        const enabled = guild.welcomeEnabled;
        if (!channel_id || !enabled || !message) return;
        const channel = await client.channels.fetch(channel_id).catch(() => { });
        if (!channel || channel.type !== 'text') return;
        channel.send(message
            .replace('{user}', member.user)
            .replace('{userTag}', member.user.tag)
            .replace(/@everyone/g, '@' + String.fromCharCode(8203) + 'everyone')
            .replace(/@here/g, '@' + String.fromCharCode(8203) + 'here')
        ).catch(() => { });
    }
}