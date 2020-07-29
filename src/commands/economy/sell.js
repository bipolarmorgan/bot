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
     */
    async run(client, message, args) {
        const item = client.shopitems.get(args[0].toLowerCase());
        if (!item) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`An item with an ID of \`${args[0]}\` doesn\'t exists`));
        }
        if (!item.options.sellable) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`You cannot sell this item.`));
        }
        if (!await message.author.db.inventory.has(item.config.id)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`You don\'t have that item to sell.`));
        }
        await message.author.db.coins.add(item.options.cost);
        await message.author.db.inventory.remove(item.config.id);
        return message.channel.send(new MessageEmbed()
            .setColor('0x00FF00')
            .setDescription(`You've sold **${item.config.displayname}**, for the price of **${item.options.cost}** Coins!`)
        );
    }
}