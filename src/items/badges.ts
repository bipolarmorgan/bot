import Client from '../classes/Unicron';
import { Message } from 'discord.js';
import User from '../classes/User';
import Item from '../classes/BaseItem';

export default class Badges extends Item {
    private badges: string[];
    constructor() {
        super({
            config: {
                id: 'badges',
                displayname: '🗳️ Badge Crate',
                description: 'Get a RANDOM BADGE!',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: true,
                price: 1500,
                cost: Math.floor(1500 * 0.3),
            }
        });
        this.badges = [
            "ZeroTwoDab", "wumpus", "Weeb", "wtf", "wlove", "weSmart", "wBrilliance",
            "wBravery", "wBalance", "waitWhat", "uwu", "troll", "thonker", "salute",
            "PizzaCat", "Pickachu", "PepoShrug", "PepoOk", "Pepolove", "Pepolaugh",
            "PepoKing", "PepoHmm", "PepoHigh", "PepoCry", "owo", "lewd", "javascript",
            "Hellolove", "happy", "goodgirl", "goodboy", "FeelsHappyMan", "FeelsEvilMan",
            "FeelsBadMan", "drakeLUL", "CryCat", "PepoClown", "Blush", "admirer"
        ];
    }
    async run(client: Client, message: Message, stats: User) {
        const msg = await message.channel.send('Rolling...');
        await client.wait(3000);
        await msg.edit(`YOU HAVE RECEIVED...`);
        await client.wait(3000);
        await msg.edit('WAIT WAIT WAIT');
        await msg.delete({ timeout: 3000 });
        const badge = this.badges[Math.floor(Math.random() * this.badges.length)];
        if (!stats.data) stats.data = { badges: [], premium: false };
        if (!stats.data.badges) stats.data.badges = [];
        if (stats.data.badges.length > 23) {
            return message.channel.send('Oh oh...it seems you already exceeded the maximum amount of badges ;(');
        }
        if (stats.hasBadge(badge)) {
            const pp = Math.floor(this.options.price * .4);
            stats.balance += pp;
            stats.removeItem(this.config.id);
            await stats.save().catch((e) => { throw e; });
            return message.channel.send(`Oh oh... it seems you already have the ${await client.getEmoji(badge)} ${badge} badge, but you received **${pp}** coins!`);
        }
        stats.addBadge(badge);
        stats.addXP(message, 120).catch((e) => { throw e; });
        stats.removeItem(this.config.id);
        await stats.save().catch((e) => { throw e; });
        return message.channel.send(`Yay! you have gotten the ${await client.getEmoji(badge)} ${badge} badge!`);
    }
}