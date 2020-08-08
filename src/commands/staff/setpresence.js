const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'setpresence',
                description: `Root Command.
\`\`\`bash
$ setpresence <Status> <Activity> <...Message>
\`\`\`
`,
                permission: 'Bot Owner',
            },
            options: {
                aliases: ['setp'],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
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
        const [status, activity, ...m] = args;
        return message.channel.send(`\`Output:\`\n\`\`\`xl\n${await client.presence(status, activity, m.join(' ')).catch((e) => { throw e; })}\n\`\`\`\n`);
    }
}