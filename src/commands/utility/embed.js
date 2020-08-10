const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'embed',
                description: `MessageEmbed Constructor! Supports JSON formatting if you know how to use them :P
\`\`\`bash
$ embed [...Message]
$ embed -json {"title": "My title", "description": "My description"}
$ embed -json {"author": {"name": "My author name", "icon_url": "url here"}, "description": "My description"}
$ embed -json {"fields": [{"name": "My field name", "value": "My field value"}, {"name": "My field name", "value": "My field value", "inline": false}]}
\`\`\`
`,
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'embed [...Text]\nembed -json [Raw JSON]',
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
        if (args.includes('-json')) {
            try {
                const json = JSON.parse(args.join(' '));
                return message.channel.send({
                    embed: json
                })
            } catch (error) {
                return message.channel.send(`\`ERROR\`\n\`\`\`xl\n${client.shorten(error, 512)}\n\`\`\``);
            }
        }
        return message.channel.send(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(client.shorten(args.join(' '), 2048))
        );
    }
}