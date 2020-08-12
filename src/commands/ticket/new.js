const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'new',
                description: 'Creates a new ticket!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'MANAGE_ROLES'],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'new <...Topic>',
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
                .setDescription('Ticket System is disabled or the Ticket Category cannot be found, contact server admins to enable/fix this\nSetup Ticket System using `config` command!')
            );
        }
        if (message.channel.parentID === strat) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Oi, you can\'t create a ticket inside a ticket ;p')
            );
        }
        if (message.guild.channels.cache.find((ch) => { return ch.type === 'text' && new RegExp(`${message.author.id}`).test(ch.topic) })) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription('Oi, you can\'t create a new ticket when you already have an open ticket ;p')
            );
        }
        const channel = await message.guild.channels.create(`ticket-${client.utils.Random.string(6)}`, {
            parent: strat,
            type: 'text',
            topic: `TicketID: ${message.author.id}\nSubject: ${args.join(' ')}`,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                },
                {
                    id: client.user.id,
                    allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES'],
                }
            ],
        }).catch((e) => {
            throw e;
        });
        await message.channel.send(new MessageEmbed()
            .setColor(0x00FF00)
            .setDescription(`Your ticket has been created! <#${channel.id}>\nWe will contact you in the ticket shortly!`)
            .setTimestamp()
            .setAuthor('Unicron Ticket System', client.user.displayAvatarURL({ dynamic: true }))
        );
        const st = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'support team');
        if (st) {
            channel.createOverwrite(st, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
            }).catch(() => { });
        }
        await channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .addField('Subject', `${args.join(' ')}`)
            .addField('Explain', "Describe your topic so it could be resolved faster!")
            .addField('Ticket by', message.author.tag)
            .setDescription(`Thank you for creating a ticket.\nThe support team will assist you soon!`)
        );
        return true;
    }
}