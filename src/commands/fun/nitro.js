const BaseCommand = require('../../classes/BaseCommand');
const path = require('path');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'nitro',
                description: 'Fake Nitro giveaway',
                permission: 'User',
            },
            options: {
                aliases: ['fakenitro', 'fake-nitro'],
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
        message.channel.send(`htt${String.fromCharCode(8203)}ps://discord.${String.fromCharCode(8203)}gift/${client.utils.Random.string(16)}`, { files: [path.join(__dirname, '..', '..', '..', 'assets', 'nitro.png')] });
    }
}