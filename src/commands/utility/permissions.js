const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'permissions',
                description: 'Tells you your permission level for the current message guild location.',
                permission: 'User',
            },
            options: {
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: '',
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
        const friendly = client.permission.levels[message.author.permLevel];
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Permission Level : ${message.author.permLevel} - ${friendly}`)
        );
    }
}