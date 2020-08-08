const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'verification',
                description: 'Member Verification module configuration. The Bot Permissions below are required for the interactive setup',
                permission: 'User',
            },
            options: {
                aliases: ['verifier'],
                clientPermissions: ['SEND_MESSAGES', 'ADD_REACTIONS', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'MANAGE_ROLES'],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: 'verification\nverification <enable|disable>',
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
        if (args.length) {
            switch (args[0].toLowerCase()) {
                case 'enable':
                case 'disable': {
                    const stat = args[0].toLowerCase() === 'enable';
                    guildSettings.verificationEnabled = stat;
                    await guildSettings.save().catch((e) => { throw e; });
                    return message.channel.send(`Member Verification has been \`${stat ? 'enabled' : 'disabled'}\`.`);
                }
                default: {
                    return message.channel.send(new MessageEmbed()
                        .setColor('RED')
                        .setTimestamp()
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }))
                        .setDescription('Error: Invalid flag provided, Please try again.')
                    );
                }
            }
        }
        await message.channel.send('Interactive Member Verification setup...');

        const response1 = await client.awaitReply(message, `Enter Verification Channel name:\nEg: \`#channel\`\n\nType \`cancel\` to exit this setup.`, 20000, true);
        if (!response1) return message.channel.send(`No response... Exiting setup...`);
        if (response1.content === 'cancel') return message.channel.send(`Exiting setup...`);
        const channel = response1.mentions.channels.first();
        if (!channel || channel.type !== 'text') return message.channel.send(`Invalid channel... Exiting setup...Please Try again...`);
        if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'ADD_REACTIONS', 'MANAGE_MESSAGES', 'MANAGE_ROLES'])) return message.channel.send('Unicron doesn\'t have permissions to that channel, please give Unicron access to that channel for this to work and try again...Exiting Setup');

        const response2 = await client.awaitReply(message, `Enter Verified Role:\nEg: \`[RoleMention|RoleID|RoleName]\``, 20000, true);
        if (!response2) return message.channel.send(`No response... Exiting setup...`);
        if (response2.content === 'cancel') return message.channel.send(`Exiting setup...`);
        const role = client.resolveRole(response2.content, message.guild);
        if (!role) return message.channel.send(`Invalid Role... Exiting setup...Try again...`);

        const response3 = await client.awaitReply(message, `Enter Verification Type:\nEg: \`[discrim|captcha|react]\``, 20000, true);
        if (!response3) return message.channel.send(`No response... Exiting setup...`);
        if (response3.content === 'cancel') return message.channel.send(`Exiting setup...`);
        if (!['discrim', 'captcha', 'react'].includes(response3.content)) return message.channel.send(`Invalid Type... Exiting setup...Please Try again...`);

        if (!channel.permissionOverwrites.get(message.guild.id)) {
            await channel.createOverwrite(message.guild.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            }).catch(() => { });
        }
        for (let channels of message.guild.channels.cache.filter((c) => c.type === 'text')) {
            channels = channels[1];
            if (!channels.permissionOverwrites.get(message.guild.id)) {
                await channels.createOverwrite(message.guild.id, {
                    VIEW_CHANNEL: false,
                }).catch(() => { });
            }
        }
        if (!channel.permissionOverwrites.get(role.id)) {
            await channel.createOverwrite(role, {
                VIEW_CHANNEL: false,
            }).catch(() => { });
        }
        guildSettings.verificationChannel = channel.id;
        guildSettings.verificationType = response3.content;
        guildSettings.verificationRole = role.id;
        guildSettings.verificationEnabled = true;
        await guildSettings.save().catch((e) => { throw e; });
        if (response3.content === 'react') {
            const m = await channel.send(new MessageEmbed()
                .setColor(0x00FF00)
                .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`This server is protected by [Unicron](${client.unicron.serverInviteURL} 'Unicron's Support Server'), a powerful bot that prevents servers from being raided, React ${await client.getEmoji('yes')} to get yourself verified!`)
            ).catch(() => { });
            await m.react(await client.getEmoji('yes')).catch(() => { });
        }
        message.channel.send('Setup complete!');
    }
}