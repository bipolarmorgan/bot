const BaseItem = require('../classes/BaseItem');

module.exports = class extends BaseItem {
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
    /**
     * @returns {Promise<boolean|import('discord.js').Message>}
     * @param {import('../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {import('../classes/User')} stats
     */
    async run(client, message, stats) {
        const msg = await message.channel.send('Rolling...');
        await client.wait(3000);
        await msg.edit(`YOU HAVE RECEIVED...`);
        await client.wait(3000);
        await msg.edit('WAIT WAIT WAIT');
        await msg.delete({ timeout: 3000 });
        const badge = this.badges[Math.floor(Math.random() * this.badges.length)];
        if (!stats.data) stats.data = { badges: [] };
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
        stats.addXP(client, message, 120).catch((e) => { throw e; });
        stats.removeItem(this.config.id);
        await stats.save().catch((e) => { throw e; });
        return message.channel.send(`Yay! you have gotten the ${await client.getEmoji(badge)} ${badge} badge!`);
    }
}