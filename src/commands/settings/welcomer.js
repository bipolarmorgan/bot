const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'welcomer',
                description: 'Welcome configuration module!',
                permission: 'Server Administrator',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'welcomer\nwelcomer channel <ChannelMention>\nwelcomer message <...Message>\nwelcomer <enable|disable>',
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
        if (!args.length) {
            await message.channel.send('Interactive Welcomer setup...');
            const response1 = await client.awaitReply(message, `Enter Channel name:\nEg: \`#channel\`\n\nType \`cancel\` to exit this setup.`, 20000, true);
            if (!response1) return message.channel.send(`No response... Exiting setup...`);
            if (response1.content === 'cancel') return message.channel.send(`Exiting setup...`);
            const channel = response1.mentions.channels.first();
            if (!channel || channel.type !== 'text') return message.channel.send(`Invalid channel... Exiting setup...Try again...`);
            if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES'])) return message.channel.send('Unicron doesn\'t have permissions to that channel, please give Unicron access to that channel for this to work and try again...Exiting Setup');
            const response2 = await client.awaitReply(message, `Ok, now Enter Welcome message (Must include \`{user}\` placeholder)\nEg: \`Welcome {user} to this awesome server!\`\n\nType \`cancel\` to exit this setup`, 40000, true);
            if (!response2) return message.channel.send(`No response... Exiting setup...`);
            if (response2 === 'cancel') return message.channel.send(`Exiting setup...`);
            if (!response2.content.includes('{user}')) return message.channel.send(`Missing placeholder \`{user}\`... Exiting setup...Try again...`);
            guildSettings.welcomeChannel = channel.id;
            guildSettings.welcomeMessage = response2.content.replace(/@/g, '@' + String.fromCharCode(8203));
            guildSettings.welcomeEnabled = true;
            await guildSettings.save().catch((e) => { throw e; });
            message.channel.send('Setup complete! Testing it now...');
            return client.emit('guildMemberAdd', message.member);
        }
        const [key, ...value] = args;
        switch (key) {
            case 'channel': {
                const channel = message.mentions.channels.first();
                if (!channel || channel.type !== 'text') return message.channel.send(`\`ERROR\`: Invalid channel... Please Try again...`);
                if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES'])) return message.channel.send('Unicron doesn\'t have permissions to that channel, please give Unicron access to that channel for this to work and try again.');
                guildSettings.welcomeChannel = channel.id;
                await guildSettings.save().catch((e) => { throw e; });
                client.emit('guildMemberAdd', message.member);
                return message.channel.send(`Welcome channel has been set to ${channel}. Testing it...`);
            }
            case 'message': {
                const msg = value.join(' ').replace(/@/g, '@' + String.fromCharCode(8203));
                if (!msg.includes('{user}')) return message.channel.send(`Missing placeholder \`{user}\`... Please try again...`);
                guildSettings.welcomeMessage = msg;
                await guildSettings.save().catch((e) => { throw e; });
                client.emit('guildMemberAdd', message.member);
                return message.channel.send(`Welcome Message has been set to \n\`${msg}\``);
            }
            case 'enable':
            case 'disable': {
                const stat = key === 'enable';
                guildSettings.welcomeEnabled = stat;
                await guildSettings.save().catch((e) => { throw e; });
                client.emit('guildMemberAdd', message.member);
                return message.channel.send(`Welcomer has been \`${stat ? 'enabled' : 'disabled'}\`.`);
            }
            default:
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription('Sorry, invalid parameters, Please try again.')
                );
        }
    }
}