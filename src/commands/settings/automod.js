const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'automod',
                description: 'Toggles Auto-Moderation on the server!',
                permission: 'Server Administrator',
            },
            options: {
                aliases: ['automoderation'],
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
        guildSettings.autoModeration = !guildSettings.autoModeration;
        await guildSettings.save().catch((e) => { throw e; });
        message.channel.send(`Auto Moderation has been ${guildSettings.autoModeration ? 'enabled' : 'disabled'}`);
    }
}