const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');
const Pagination = require('../../utils/Pagination');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'leaderboard',
                description: `Shows leaderboard`,
                permission: 'User',
            },
            options: {
                aliases: ['top'],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: `leaderboard`,
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
        const cache = client.db.users.cache.filter((i) => message.guild.members.cache.has(i.id) && client.users.cache.has(i.id)).sort((a, b) => b.balance - a.balance);
        /**
         * @type {[import('../../classes/User')[]]}
         */
        const users = client.chunk(cache, 12);
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
        Pagination(message, embeds);
    }
}