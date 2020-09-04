import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Paginate from '../../utils/Pagination';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class Shop extends Command {
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
    async run(client: Client, message: Message, args: string[], guildSettings: Guild, userStats: User) {
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
                    .setDescription(`Sorry, That item does not exist in the Shop.`));
            };
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${item.config.displayname}`)
                .setDescription(`**Price** : **${item.options.price}**\n**Description** : ${item.config.description}\n**ID** : \`${item.config.id}\``));
        }
        const items = client.shopitems.sort((a, b) => b.options.price - a.options.price).filter((item) => item.options.buyable);
        const chunks = client.chunk(items.array(), 4);
        const embeds = chunks.map((ia) => {
            let embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('**Unicron Shop**')
                .setDescription(`You can also do \`${guildSettings.prefix}shop view <Item>\` to get an information of a specific item.\nYou currently have **${userStats.balance}** 💰`);
            ia.map((i) => {
                embed.addField(`${i.config.displayname} ─ __**${i.options.price}**__ Coins`, `• ${i.config.description}\nID \`${i.config.id}\``, false);
            });
            return embed;
        });
        Paginate(message, embeds);
    }
}