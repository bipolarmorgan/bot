import Client from '../classes/Unicron';
import { Message, MessageEmbed } from 'discord.js';
import Item from '../classes/BaseItem';
import User from '../classes/User';

export default class Bread extends Item {
    constructor() {
        super({
            config: {
                id: 'bread',
                displayname: '🍞 Bread',
                description: 'Tasty Bread ma man',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: true,
                price: 20,
                cost: Math.floor(20 * 0.3),
            }
        });
    }
    async run(client: Client, message: Message, stats: User) {
        stats.addXP(message, 40);
        stats.removeItem(this.config.id);
        await stats.save().catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('Ah yes, this bread is so delicious')
        );
    }
}