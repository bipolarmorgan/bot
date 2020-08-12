const { MessageEmbed } = require('discord.js');
const BaseItem = require('../classes/BaseItem');

module.exports = class extends BaseItem {
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
    /**
     * @returns {Promise<boolean|import('discord.js').Message>}
     * @param {import('../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {import('../classes/User')} stats
     */
    async run(client, message, stats) {
        stats.addXP(client, message, 120);
        stats.removeItem(this.config.id);
        await stats.save().catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
            .setDescription('Uh HUH! this cookieeeeeeeee!')
        );
    }
}