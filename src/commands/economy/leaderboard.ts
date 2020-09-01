import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Paginate from '../../utils/Pagination';

export default class Leaderboard extends Command {
    constructor() {
        super({
            config: {
                name: 'leaderboard',
                description: `Shows leaderboard`,
                permission: 'User',
            },
            options: {
                aliases: ['top'],
                clientPermissions: [],
                premiumServer: false,
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: `leaderboard`,
                donatorOnly: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        const cache = client.db.users.cache.filter((i) => message.guild.members.cache.has(i.id) && client.users.cache.has(i.id)).sort((a, b) => b.balance - a.balance);
        const users = client.chunk(cache.array(), 12);
        const mapped = cache.map((p) => p);
        const embeds = users.map((us) => {
            const f1 = us.map((u) => `**${mapped.indexOf(u) + 1}** | ${client.users.cache.get(u.id).tag}`).join('\n');
            const f2 = us.map((u) => `**${u.balance}** 💰`).join('\n');
            const whereIam = mapped.indexOf(cache.get(message.author.id)) + 1;
            return new MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle('Unicron Leaderboard')
                .setDescription(`${message.author.tag}'s ranking \`${whereIam}/${mapped.length}\``)
                .addField('**Richest Users**', f1, true)
                .addField('**Coins**', f2, true)
        });
        Paginate(message, embeds);
    }
}