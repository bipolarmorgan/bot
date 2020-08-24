const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'dvlimit',
                description: 'Set user limit to your dynamic voice channel!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'dvlimit <Limit>',
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
        if (!category || !enabled) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Sorry, the Dynamic System for this server is currently disabled\nTry setting this up using `config` command or set this up through our dashboard https://unicron-bot.xyz/')
            );
        }
        const categoryC = message.guild.channels.cache.get(category);
        if (!categoryC || !categoryC.permissionsFor(client.user).has(['MANAGE_CHANNELS'])) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Oh oh, it seems that the dynamic category is deleted or i don\'t have access to it')
            );
        }
        if (!message.member.voice) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('hey, you need to be connected to a voice channel to do this')
            );
        }
        if (message.member.voice.guild.id !== message.guild.id) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Oh oh, it seems that you are connected to a voice channel that is not on this server')
            );
        }
        /**
         * @type {import('discord.js').VoiceChannel}
         */
        const channel = message.guild.channels.cache.get(message.member.voice.channelID);

        const userLimit = Number(args[0]);
        if (isNaN(limit) || userLimit < 1) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Sorry but the user limit cannot go below 1 user')
            );
        }
        try {
            await channel.edit({
                userLimit,
            }).catch((e) => { throw e });
            message.channel.send('User Limit has been set!');
        } catch (error) {
            message.channel.send(`Oh oh, something went wrong setting the user limit\n${error.message}`);
        }
    }
}