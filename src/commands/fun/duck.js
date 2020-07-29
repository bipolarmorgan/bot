const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'duck',
                description: 'Random pictures of a duck!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
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
        try {
            const response = await fetch('https://random-d.uk/api/v1/random');
            const { url: attachment } = await response.json();
            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setDescription('https://random-d.uk/')
                .setImage(attachment)
            );
        } catch (e) {
            throw e;
        }
    }
}