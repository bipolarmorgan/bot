const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'ping',
                description: 'Checks Bot\'s ping and API Latency',
                permission: 'User',
            },
            options: {
                aliases: ['botping'],
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
     */
    async run(client, message, args) {
        return message.channel.send('Ping?').then(msg => {
            msg.edit(`Pong! Latency is \`${Math.round(msg.createdTimestamp - message.createdTimestamp)}ms\`.\nAPI Latency is \`${Math.round(client.ws.ping)}ms\``);
        }).catch((e) => {
            client.logger.error(`Error : ${e}`);
            return false;
        });
    }
}