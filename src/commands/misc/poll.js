const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'poll',
                description: 'Make polls using this command!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['ADD_REACTIONS'],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'poll <Poll Question>',
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
        try {
            await message.react(await client.getEmoji('yes'));
            await message.react(await client.getEmoji('no'));
            await message.react(await client.getEmoji('PepoShrug'));
        } catch (e) {
            client.logger.warn(`Reactions did not react on ${message.guild.name} / ${message.guild.id} / ${message.id}`);
            return false;
        }
    }
}