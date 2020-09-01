import Item from "../classes/BaseItem";
import Client from "../classes/Unicron";
import { Message, MessageEmbed } from "discord.js";
import User from "../classes/User";

export default class Pancake extends Item {
    constructor() {
        super({
            config: {
                id: 'pancake',
                displayname: '🥞 Pancake',
                description: 'It\'s a cake made from a frying pan!',
            },
            options: {
                buyable: true,
                sellable: false,
                usable: true,
                price: 350,
                cost: Math.floor(350 * 0.3),
            }
        });
    }
    async run(client: Client, message: Message, stats: User) {
        stats.addXP(message, 150);
        stats.removeItem(this.config.id);
        await stats.save().catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('Ay yes... PANCAKES')
        );
    }
}