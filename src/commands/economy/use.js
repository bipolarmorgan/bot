const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'use',
                description: 'Use an item from your inventory!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 60,
                nsfwCommand: false,
                args: true,
                usage: 'use <Item>',
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
     * @param {import('../../classes/User')} s
     */
    async run(client, message, args, g, s) {
        const item = client.shopitems.get(args[0].toLowerCase());
        if (!item) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('That\'s an invalid item.'));
            return false;
        }
        if (!s.hasItem(item.config.id)) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Sorry, but you don\'t have a ${item.config.displayname}.`));
            return false;
        }
        if (!item.options.usable) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Sorry, you cannot use this item'));
            return false;
        }
        return await item.run(client, message, s).catch((e) => { throw e });
    }
}