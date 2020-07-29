const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'penis',
                description: 'User Penis length identifier 1000',
                permission: 'User',
            },
            options: {
                cooldown: 12,
                args: false,
                usage: 'penis [UserMention|UserID]',
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
        let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${target.tag}\'s penis`);
        let max = client.utils.Random.nextInt({ max: 30, min: 0 });
        let gland = '';
        for (let i = 0; i < max; i++) {
            gland += '=';
        }
        embed.setDescription(`8${gland}D`);
        return message.channel.send(embed);
    }
}