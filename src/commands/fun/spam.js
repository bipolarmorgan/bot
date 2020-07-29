const BaseCommand = require('../../classes/BaseCommand');
const path = require('path');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'spam',
                description: 'Shows image of the SPAM brand',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['ATTACH_FILES'],
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
        message.channel.send('', { files: [path.join(__dirname, '..', '..', '..', 'assets', 'spam.png')] })
    }
}