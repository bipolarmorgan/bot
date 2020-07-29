const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'payday',
                description: 'ITS PAYDAY',
                permission: 'User',
            },
            options: {
                aliases: ['daily'],
                clientPermissions: [],
                cooldown: 60 * 60 * 24,
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
        const prize = client.utils.Random.nextInt({ max: 1200, min: 1000 });
        await message.author.db.coins.add(prize);
        message.channel.send(`You have received **${prize}** coins!`);
    }
}