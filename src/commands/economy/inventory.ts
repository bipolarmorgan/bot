import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Paginate from '../../utils/Pagination';

export default class Inventory extends Command {
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
    async run(client: Client, message: Message, args: string[]) {
        let target = await client.resolveUser(args[0]) || message.author;
        if (!target) target = message.author;
        const userp = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        const items = userp.inventory;
        if (!items.length) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTitle(`**${target.tag}'s** Inventory`)
                .setDescription(`**NOTHING**`));
            return false;
        }
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