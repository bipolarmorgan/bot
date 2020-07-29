const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'gayrate',
                description: 'Gay rate command!',
                permission: 'User',
            },
            options: {
                aliases: ['gay', 'howgay'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: '',
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
        const stat = client.utils.Random.nextInt({ max: 101, min: 0 });
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`Gay Rate hehe`)
            .setDescription(`${target.tag} is ${stat}% gay :rainbow_flag: `)
        );
    }
}