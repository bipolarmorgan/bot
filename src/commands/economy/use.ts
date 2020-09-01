import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class Use extends Command {
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
    async run(client: Client, message: Message, args: string[], g: Guild, s: User) {
        const item = client.shopitems.get(args[0].toLowerCase());
        if (!item) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('That\'s an invalid item'));
            return false;
        }
        if (!s.hasItem(item.config.id)) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`Sorry, but you don\'t have a ${item.config.displayname}`));
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