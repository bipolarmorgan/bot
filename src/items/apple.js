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
     */
    async run(client, message) {
        await message.author.db.levelup(client, message, 20);
        await message.author.db.inventory.remove(this.config.id);
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
            .setDescription('Hmmmmm this tasty apple!')
        );
    }
}