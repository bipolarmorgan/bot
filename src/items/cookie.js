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
     */
    async run(client, message) {
        await message.author.db.levelup(client, message, 120);
        await message.author.db.inventory.remove(this.config.id);
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
            .setDescription('Uh HUH! this cookieeeeeeeee!')
        );
    }
}