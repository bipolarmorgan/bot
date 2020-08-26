const { MessageEmbed } = require('discord.js');
const BaseItem = require('../classes/BaseItem');

module.exports = class extends BaseItem {
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
    /**
     * @returns {Promise<boolean|Message>}
     * @param {Client} client 
     * @param {Message} message 
     * @param {import('../classes/User')} stats
     */
    async run(client, message, stats) {
        stats.addXP(client, message, 150);
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