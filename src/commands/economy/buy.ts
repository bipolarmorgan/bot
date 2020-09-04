import Command from '../../classes/BaseCommand';
import { MessageEmbed, Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class buy extends Command {
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
    async run(client: Client, message: Message, args: string[], _g: Guild, userStats: User) {
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