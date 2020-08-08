const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'sell',
                description: 'Sells an item from your inventory!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'sell <Item ID>',
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
    async run(client, message, args, _g, s) {
        const item = client.shopitems.get(args[0].toLowerCase());
        if (!item) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Sorry, An item with an ID of \`${args[0]}\` doesn\'t exists`));
        }
        if (!item.options.sellable) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Sorry, but you cannot sell this item.`));
        }
        if (!s.hasItem(item.config.id)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Sorry, you don\'t have that item to be sold.`));
        }
        s.balance += item.options.cost;
        s.removeItem(item.config.id);
        await s.save().catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor('0x00FF00')
            .setDescription(`You've sold **${item.config.displayname}**, for the price of **${item.options.cost}** Coins!`)
        );
    }
}