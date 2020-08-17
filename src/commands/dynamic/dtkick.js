const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'dtkick',
                description: 'Kick a user from your private text channel!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'dtkick <...Mentions>',
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
        const category = guildSettings.dynamicCategory;
        const enabled = guildSettings.dynamicEnabled;
        if (!category || !enabled || !message.guild.channels.cache.get(category)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Hey, Dynamic Feature is disabled or Dynamic Category cannot be found, contact server admins to enable/fix this\nSetup Dynamic Text/Voice System using `config` command!')
            );
        }
        if (message.channel.parentID !== category) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Hey, you can\'t kicks users outside a private text channel')
            );
        }
        if (!message.channel.permissionsFor(message.member).has(['MANAGE_CHANNEL'])) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Hey, you can\'t kick users from this private channel')
            );
        }
        const users = message.mentions.users;
        if (!users) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Hey, you need to mention who you gonna kick from this channel')
            );
        }
        for (const m of users) {
            await message.channel.createOverwrite(m[0], {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
                READ_MESSAGE_HISTORY: false,
            }).catch(() => { });
        }
        message.channel.send(`Member(s) has been added to this channel`);
    }
}