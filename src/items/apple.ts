import Client from '../classes/Unicron';
import { Message, MessageEmbed } from 'discord.js';
import User from '../classes/User';
import Item from '../classes/BaseItem';

export default class Apple extends Item {
    constructor() {
        super({
            config: {
                id: 'apple',
                displayname: '🍎 Apple',
                description: 'An apple fell from the tree!',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: true,
                price: 15,
                cost: Math.floor(15 * 0.3),
            }
        });
    }
    async run(client: Client, message: Message, stats: User) {
        stats.addXP(message, 20);
        stats.removeItem(this.config.id);
        await stats.save().catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('Hmmmmm this tasty apple!')
        );
    }
}