const fortune = require('../../../assets/fortuneCookies.json');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'fortune',
                description: 'Shows you a fortune from a fortune cookie.',
                permission: 'User',
            },
            options: {
                aliases: ['cookie'],
                cooldown: 15,
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
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor('Your fortune says...', client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(fortune[Math.floor(Math.random() * fortune.length)])
        );
    }
}