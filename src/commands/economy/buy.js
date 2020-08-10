const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'buy',
                description: 'Buys an item from the shop!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'buy <Item ID>',
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
    async run(client, message, args, _g, userStats) {
        const item = client.shopitems.get(args[0]);
        if (!item) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('That item doesn\'t exist in the Unicron Shop'));
            return false;
        }
        if (!item.options.buyable) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('This item is not for sale.'));
            return false;
        }
        if (item.options.price > userStats.balance) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`You need **${item.options.price - userStats.balance}** more coins to buy this item.`));
            return false;
        }
        userStats.balance -= item.options.price;
        userStats.addItem(item.config.id);
        await userStats.save().catch((e) => { throw e; });
        message.channel.send(new MessageEmbed()
            .setColor(0x00FF00)
            .setDescription(`You've bought: **${item.config.displayname}** , for the price of **${item.options.price}** Coins!`)
        );
    }
}