const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'profile',
                description: 'Check user Profile',
                permission: 'User',
            },
            options: {
                aliases: [],
                cooldown: 5,
                nsfwCommand: false,
                args: false,
                usage: 'profile [User]',
                donatorOnly: false,
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
        let target = await client.resolveUser(args[0]) || message.author;
        if (!target) target = message.author;
        if (target.bot) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Sorry, i cannot show the profile of a bot user.'));
        }
        const profile = await client.database.users.fetch(target.id, true);
        const badges = client.chunk(profile.badges.fetch(), 8);
        const balance = profile.coins.fetch();
        const inventory = await profile.inventory.fetch();
        const level = profile.experience.getLevel();
        const progress = profile.experience.getProgressBar();
        const req = profile.experience.getRequiredExpToNextLevel();
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
            .setTimestamp()
            .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }) || null)
            .addField('**Progress**', `**${level}** [${progress}](${client.unicron.serverInviteURL}) **${level + 1}**\n**${req}** - remaining`, true)
            .addField('**Badges**', badgeText, true)
            .addField('\u200b', '\u200b', true)
            .addField('**Coins**', `**${balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** 💰`, true)
            .addField('**Inventory**', `**${inventoryCount}** item(s)`, true)
        );
    }
}