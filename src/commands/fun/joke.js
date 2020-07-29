const BaseCommand = require('../../classes/BaseCommand');
const joke = require('one-liner-joke');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'joke',
                description: 'Get a random joke!',
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
        message.channel.send(joke.getRandomJoke().body);
    }
}