const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'invitefilter',
                description: 'Toggles inviteFilter module',
                permission: 'Server Administrator',
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
        const toggle = message.guild.db.filters(true);
        toggle.inviteFilter = !toggle.inviteFilter;
        await toggle.save();
        message.channel.send(`inviteFilter has been ${toggle.inviteFilter ? 'enabled' : 'disabled'}`);
    }
}