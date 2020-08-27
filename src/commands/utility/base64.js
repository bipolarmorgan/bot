const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'base64',
                description: 'Encode/Decode Base64',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'base64 <encode|decode> <text>',
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
     * @param {import('../../classes/Guild')} g
     */
    async run(client, message, args, g) {
        const [mode, ...text] = args;
        if (!['encode', 'decode'].includes(mode)) {
            return message.channel.send(`Incorrect mode, please use \`encode\` or \`decode\`\n\`${g.prefix}base64 <Mode> <Text>\``);
        }
        if (!text.length) {
            return message.channel.send(`Invalid Arguments please use \`${g.prefix}base64 ${mode} <Text>\``);
        }
        switch (mode) {
            case 'encode': {
                message.channel.send(`\`OUTPUT\`\n\`\`\`xl\n${client.base64(text.join(' '), 'encode')}\n\`\`\``);
                break;
            }
            case 'decode': {
                message.channel.send(`\`OUTPUT\`\n\`\`\`xl\n${client.base64(text.join(' '), 'decode').replace(/`/g, '`' + String.fromCharCode(8203))}\n\`\`\``);
                break;
            }
        }
    }
}