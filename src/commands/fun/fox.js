const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'fox',
                description: 'Random pictures of a fox',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: '',
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
     */
    async run(client, message, args) {
        const response = await fetch('https://randomfox.ca/floof/');
        const { image } = await response.json();
        message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setDescription('https://randomfox.ca/')
            .setImage(image)
        );
    }
}