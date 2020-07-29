const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'check',
                description: 'Make the bot react [/]',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['ADD_REACTIONS'],
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
        message.react(await client.getEmoji('yes')).catch(() => {
            message.channel.send('Oops, there was a problem reacting');
        })
    }
}