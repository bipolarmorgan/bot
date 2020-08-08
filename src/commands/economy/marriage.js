const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'marriage',
                description: 'Shows marriage certificate of a user',
                permission: 'User',
            },
            options: {
                aliases: ['waifu'],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: 'marriage [UserMention|UserID]',
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
        let target = await client.resolveUser(args[0]) || message.author;
        if (!target) target = message.author;
        const t = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        if (!t.marriage_id) {
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Not married to someone else, kek')
            );
        }
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }) || null)
            .setTitle('Marriage Certificate')
            .setDescription(`<@${target.id}> ❤️ <@${t.marriage_id}>`)
        );
    }
}