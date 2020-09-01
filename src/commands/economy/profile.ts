import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Profile extends Command {
    constructor() {
        super({
            config: {
                name: 'profile',
                description: 'Check user Profile',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                premiumServer: false,
                cooldown: 5,
                nsfwCommand: false,
                args: false,
                usage: 'profile [User]',
                donatorOnly: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        let target = await client.resolveUser(args[0]) || message.author;
        if (!target) target = message.author;
        if (target.bot) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Sorry, i cannot show the profile of a bot user.'));
        }
        const profile = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        const badges = profile.data.badges ? client.chunk(profile.data.badges, 8) : [];
        const balance = profile.balance;
        const inventory = profile.inventory;
        const level = profile.level;
        const progress = profile.progressbar;
        const req = profile.progressXP;
        const inventoryCount = inventory.reduce((acc, cur) => {
            return acc += cur.amount;
        }, 0);
        let badgeText = '\u200b';
        for (var i = 0; i < badges.length; i++) {
            for (var j = 0; j < badges[i].length; j++) {
                badgeText += `${await client.getEmoji(badges[i][j])}  `;
            }
            badgeText += '\n';
        }
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }))
            .addField('**Progress**', `**${level}** [${progress}](${client.unicron.serverInviteURL}) **${level + 1}**\n**${req}** - remaining`, true)
            .addField('**Badges**', badgeText, true)
            .addField('\u200b', '\u200b', true)
            .addField('**Coins**', `**${balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** 💰`, true)
            .addField('**Inventory**', `**${inventoryCount}** item(s)`, true)
        );
    }
}