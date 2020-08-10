const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'avatar',
                description: 'Check user avatar',
                permission: 'User',
            },
            options: {
                aliases: ['av'],
                cooldown: 3,
                args: false,
                usage: `avatar [User]`,
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
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(target.tag, target.avatarURL({ dynamic: true }))
            .setImage(target.displayAvatarURL({ dynamic: true }))
        );
    }
}