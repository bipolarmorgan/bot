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
     * @param {import('../../classes/User')} userStats
     */
    async run(client, message, _args, _g, userStats) {
        const prize = client.utils.Random.nextInt({ max: 1200, min: 1000 });
        userStats += prize;
        await userStats.save().catch((e) => { throw e; });
        message.channel.send(`You have received **${prize}** coins!`);
    }
}