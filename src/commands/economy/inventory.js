const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');
const Paginate = require('../../utils/Pagination');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'inventory',
                description: 'Shows user\'s inventory!',
                permission: 'User',
            },
            options: {
                aliases: ['inv'],
                clientPermissions: [],
                cooldown: 8,
                nsfwCommand: false,
                args: false,
                usage: 'inventory [User]',
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
     */
    async run(client, message, args) {
        const target = await client.resolveUser(args.join(' ')) || message.author;
        /**
         * @type {import('../../classes/User')}
         */
        let userp = await client.db.users.fetch(target.id).catch(console.log);
        if (!userp) userp = await client.db.users.fetch(target.id).catch(console.log);
        const items = userp.inventory;
        if (!items.length) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTitle(`**${target.tag}'s** Inventory`)
                .setDescription(`**NOTHING**`));
            return false;
        }
        /**
         * @type {{item_id:string, amount:number}[][]}
         */
        const chunks = client.chunk(items.sort((a, b) => b.amount - a.amount), 4);
        const embeds = chunks.map((ia) => {
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`**${target.tag}'s** Inventory`);
            ia.map((m) => {
                const p = client.shopitems.get(m.item_id);
                embed.addField(`**${m.amount} ~ ${p.config.displayname}**`, `• ${p.config.description}\n Cost : **${p.options.cost}** coins`);
            });
            return embed;
        });
        Paginate(message, embeds);
    }
}