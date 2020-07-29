const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'sha512',
                description: 'SHA512 Encryption',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'sha512 <...Text>',
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
        return message.channel.send(client.hash(args.join(' '), 'sha512'));
    }
}