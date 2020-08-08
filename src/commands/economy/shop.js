const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');
const Pagination = require('../../utils/Pagination');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'shop',
                description: 'Shows buyable items from the shop!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: 'shop view <Item>\nshop',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     * @param {import('../../classes/Guild')} guildSettings
     * @param {import('../../classes/User')} userStats
     */
    async run(client, message, args, guildSettings, userStats) {
        const [action, key] = args;
        if (action === 'view') {
            if (!key) {
                return message.channel.send(new MessageEmbed()
                    .setColor(`RED`)
                    .setDescription(`You didn\'t provide any arguments at \`[item]\`
                                Usage: \`${guildSettings.prefix}shop view <Item ID>\`
                                Example: \`${guildSettings.prefix}shop view bread\``));
            }
            const item = client.shopitems.get(key.toLowerCase());
            if (!item) {
                return message.channel.send(new MessageEmbed()
                    .setColor(`RED`)
                    .setDescription(`Sorry, That item does not exist in the Unicron Shop.`));
            };
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${item.config.displayname}`)
                .setDescription(`**Price** : **${item.options.price}**\n**Description** : ${item.config.description}\n**ID** : \`${item.config.id}\``));
        }
        const items = client.shopitems.sort((a, b) => b.options.price - a.options.price).filter((item) => item.options.buyable);
        /**
         * @type {[import('../../classes/BaseItem')[]]}
         */
        const chunks = client.chunk(items, 4);
        const embeds = chunks.map((ia) => {
            let embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('**Unicron Shop**')
                .setDescription(`You can also do \`${guildSettings.prefix}shop view <Item>\` to get an information of a specific item.\nYou currently have **${userStats.balance}** 💰`);
            ia.map((i) => {
                embed.addField(`${i.config.displayname} ─ __**${i.options.price}**__ Coins`, `• ${i.config.description}\nID : \`${i.config.id}\``, false);
            });
            return embed;
        });
        Pagination(message, embeds);
    }
}