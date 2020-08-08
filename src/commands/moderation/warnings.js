const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');
const Pagination = require('../../utils/Pagination');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'warnings',
                description: 'View warnings of a server member!',
                permission: 'User',
            },
            options: {
                aliases: ['warns'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: 'warnings <User>',
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
        if (!target || target.bot) target = message.author;

        /**
         * @type {import('../../classes/Member')}
         */
        const mem = await client.db.members.fetch(message.guild.id, target.id).catch(console.log);
        if (!mem.data || !mem.data.warnings) {
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${target.tag} / ${target.id}`, target.displayAvatarURL({ dynamic: true }))
                .setTimestamp().setDescription('No warnings here')
            );
        }
        /**
         * @type {[[{reason:string, moderator:string, date:string, case:number}]]}
         */
        const warns = client.chunk(mem.data.warnings || [], 4);
        /**
         * @type {import('discord.js').MessageEmbed[]}
         */
        const embeds = warns.map((ws) => {
            let embed = new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${target.tag} / ${target.id}`, target.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            ws.map((w) => embed.addField(`**Case ${w.case}**`, `**Reason** : ${w.reason}\n**Moderator** : ${w.moderator}\n**Date** : ${w.date}`));
            return embed;
        });
        Pagination(message, embeds);
    }
}