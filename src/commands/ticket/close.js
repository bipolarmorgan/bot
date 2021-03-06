const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');
const GuildTickets = require('../../classes/GuildTickets');

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
        if (!stat || !strat) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Sorry, the Ticket System for this server is currently disabled\nTry setting this up using `config` command or set this up through our dashboard https://unicron-bot.xyz/')
            );
        }
        const category = message.guild.channels.cache.get(strat);
        if (!category || !category.permissionsFor(client.user).has(['MANAGE_CHANNELS'])) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Oh oh, it seems that the ticket category is/was deleted or i don\'t have access to it')
            );
        }
        const db = new GuildTickets(message.guild.id);
        const ticket = await db.find(message.author.id);
        if (!ticket || message.channel.id !== ticket.channel) return message.channel.send('Oi, you can\'t close this ticket cuz its not a ticket');
        const support_role = message.guild.roles.cache.find((r) => r.name.toLowerCase() === 'support team');
        if (message.author.id === ticket.id ||
            (support_role && message.member.roles.cache.has(support_role.id)) ||
            message.member.permissions.has('MANAGE_GUILD')
        ) {
            const response = await client.awaitReply(message, 'Are you sure to close this ticket? yes/no', 15000, true);
            if (!response || response.content.toLowerCase() === 'no' || response.content.toLowerCase() !== 'yes') return message.channel.send('i guess not then');
            const modchannel = message.guild.channels.cache.get(settings.modLogChannel);
            if (modchannel) {
                await modchannel.send(new MessageEmbed()
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`Ticket closed`)
                    .setDescription(`Ticket : \`${message.channel.name}\`\nReason : ${args.join(' ') || 'No reason provided'}`)
                ).catch(() => { });
            }
            await message.channel.delete('Ticket closed.');
        } else return message.channel.send('Sorry, you don\'t have the permission to close this ticket');
    }
}