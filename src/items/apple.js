const { MessageEmbed } = require('discord.js');
const BaseItem = require('../classes/BaseItem');

module.exports = class extends BaseItem {
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
    /**
     * @returns {Promise<boolean|import('discord.js').Message>}
     * @param {import('../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {import('../classes/User')} stats
     */
    async run(client, message, stats) {
        stats.addXP(client, message, 20);
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