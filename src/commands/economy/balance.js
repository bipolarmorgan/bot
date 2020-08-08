const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'balance',
                description: 'Shows User Balance',
                permission: 'User',
            },
            options: {
                aliases: ['bal'],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: 'balance [User]',
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
                .setDescription('Error: Cannot show balance of a bot user.'));
        }
        const user = await client.db.users.fetch(target.id);
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(`**${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** 💸`)
        );
    }
}