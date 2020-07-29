const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'sweep',
                description: 'Forcefully sweep cached data from the bot',
                permission: 'Bot Owner',
            },
            options: {
                cooldown: 3,
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
        message.channel.send(`Sweeping...`);
        client.forceSweep(!isNaN(args[0]) ? Number(args[0]) : 25);
    }
}