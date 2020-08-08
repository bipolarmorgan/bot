const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'close',
                description: 'Close a ticket!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'MANAGE_ROLES'],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: 'close [...Reason]',
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
     * @param {import('../../classes/Guild')} settings
     */
    async run(client, message, args, settings) {
        const stat = settings.ticketEnabled;
        const strat = settings.ticketCategory;
        if (!stat || !strat || !message.guild.channels.cache.get(strat)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Ticket System is disabled or the Ticket Category cannot be found, contact server admins to enable/fix this')
            );
        }
        if (message.channel.parentID !== strat) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Oi, you can\'t close this ticket cuz it\'s not a ticket ;p')
            );
        }
        const response = await client.awaitReply(message, 'Are you sure to close this ticket? yes/no', 15000, true);
        if (!response || response.content === 'no' || response.content !== 'yes') {
            return message.channel.send('i guess not.')
        }
        const modchannel = message.guild.channels.cache.get(await message.guild.db.moderation('modLogChannel'));
        if (modchannel) {
            modchannel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Ticket closed`)
                .setDescription(`Ticket : \`${message.channel.name}\`\nReason : ${args.join(' ') || 'No reason provided'}`)
            );
        }
        await message.channel.delete('Ticket closed.');
    }
}