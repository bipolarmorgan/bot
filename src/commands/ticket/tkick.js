const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');
const GuildTickets = require('../../classes/GuildTickets');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'tinvite',
                description: 'Invite a user to a ticket using this command!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'MANAGE_ROLES'],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'tinvite <User>',
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
        const target = await client.resolveUser(args.join(' '));
        if (!target) return message.channel.send('Sorry, you can\'t kick invalid users from this ticket');
        if (target.id === message.author.id) return message.channel.send('Sorry, you cannot kick yourself from this ticket');
        const db = new GuildTickets(message.guild.id);
        const ticket = await db.find(message.author.id);
        if (!ticket || message.channel.id !== ticket.channel) return message.channel.send('Oi, you can\'t kick users from this ticket because it\'s not a ticket :P');
        const support_role = message.guild.roles.cache.find((r) => r.name.toLowerCase() === 'support team');
        if (message.author.id === ticket.id ||
            (support_role && message.member.roles.cache.has(support_role.id)) ||
            message.member.permissions.has('MANAGE_GUILD')
        ) {
            await message.channel.createOverwrite(target, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
                READ_MESSAGE_HISTORY: false,
            }).catch((e) => { 
                console.error(e);
                return message.channel.send('Sorry, something went wrong kicking the user');
            });
        } else return message.channel.send('Sorry, you don\'t have the permission to kick users from this ticket');
    }
}