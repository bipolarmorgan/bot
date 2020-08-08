const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'hourly',
                description: 'Get paid per hour using this command!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3600,
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
        const prize = client.utils.Random.nextInt({ max: 700, min: 500 });
        userStats.balance += prize;
        await userStats.save().catch((e) => { throw e; });
        message.channel.send(`You have gotten **${prize}** coins!`);
    }
}