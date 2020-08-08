const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'prefix',
                description: 'Shows Unicron\'s prefix for this server.',
                permission: 'User',
            },
            options: {
                cooldown: 3,
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
     * @param {import('../../classes/Guild')} settings
     */
    async run(client, message, args, settings) {
        const prefix = settings.prefix;
        return message.channel.send(new MessageEmbed()
            .setColor(0x00FFFF)
            .setDescription(`
            My Prefix for this Server/Guild is \`${prefix}\` or you can just ping me as the prefix.\n
            You can change my prefix using \`${prefix}config set prefix [prefix]\` but you need permission level \`Server Administrator\`.`
            )
        );
    }
}