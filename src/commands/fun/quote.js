const quotes = require('../../../assets/quotes.json');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'quote',
                category: 'fun',
                description: 'Shows a random quote to get you inspired.',
                permission: 'User',
            },
            options: {
                aliases: ['quotes'],
                cooldown: 10,
            }
        });
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async run(client, message, args) {
        const index = quotes[Math.floor(Math.random() * quotes.length)]
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${index.quote}`)
            .setFooter(`- ${index.author}`)
        );
    }
}