import Item from '../classes/BaseItem';
import Client from '../classes/Unicron';
import User from '../classes/User';
import { MessageEmbed, Message } from 'discord.js';

export default class Cookie extends Item {
    constructor() {
        super({
            config: {
                id: 'cookie',
                displayname: '🍪 Cookie',
                description: 'Special made cookie just for you!',
            },
            options: {
                buyable: true,
                sellable: false,
                usable: true,
                price: 250,
                cost: Math.floor(250 * 0.3),
            }
        });
    }
    async run(client: Client, message: Message, stats: User) {
        stats.addXP(message, 120);
        stats.removeItem(this.config.id);
        await stats.save().catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('this yummy cookieeeeeeeee!')
        );
    }
}