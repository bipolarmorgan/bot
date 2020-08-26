const { MessageEmbed } = require('discord.js');
const BaseItem = require('../classes/BaseItem');

module.exports = class extends BaseItem {
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
    /**
     * @returns {Promise<boolean|Message>}
     * @param {Client} client 
     * @param {Message} message 
     * @param {import('../classes/User')} stats
     */
    async run(client, message, stats) {
        stats.addXP(client, message, 40);
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