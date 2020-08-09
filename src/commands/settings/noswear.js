const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'noswear',
                description: 'Toggles Swear Filter module',
                permission: 'Server Administrator',
            },
            options: {
                aliases: ['swearfilter'],
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
     * @param {import('../../classes/Guild')} guildSettings
     */
    async run(client, message, args, guildSettings) {
        guildSettings.swearFilter = !guildSettings.swearFilter;
        await guildSettings.save().catch((e) => { throw e; });
        message.channel.send(`Swear Filter has been ${guildSettings.swearFilter ? 'enabled' : 'disabled'}`);
    }
}