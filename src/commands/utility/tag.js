const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'tag',
                description: `Create a tag, delete a tag, edit a tag, show a tag, list all tags
Creating/Removing/Editing a tag requires permission level \`Server Moderator\`
\`\`\`html
tag <Tag Name>
tag list
tag <create|edit> <Tag Name> <...Value>
tag delete <Tag Name>
\`\`\`
`,
                permission: 'User',
            },
            options: {
                aliases: ['tags'],
                cooldown: 3,
                args: true,
                usage: `tag <Tag name>\ntag <create|edit|delete|list> <Tag name> <...value>`,
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
        const [action, key, ...value] = args;
        if (message.author.permLevel >= 2) {
            switch (action) {
                case 'create': {
                    if (action === key || 'edit' === key || 'delete' === key || 'list' === key) {
                        return message.channel.send(new MessageEmbed()
                            .setColor('RED')
                            .setDescription('Sorry, you can\'t create a tag named \`create\`, \`edit\`, \`list\` or \`delete\` :P'))
                    }
                    break;
                }
                case 'edit': {
                    break;
                }
                case 'delete': {
                    break
                }
                default: {
                    break;
                }
            }
        }
        switch (action) {
            case 'create':
            case 'edit':
            case 'delete': {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`Sorry, You do not have the permissions to create/edit/delete a tag :P`)
                );
            }
            case 'list': {
                return message.channel.send(new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(message.guild.name, message.guild.iconURL() || null)
                    .setTitle(`${message.guild.name}'s Tag`)
                    .setDescription(msg)
                    .setTimestamp()
                );
            }
            default: {
                return message.channel.send(await msg.replace(/@/g, '@' + String.fromCharCode(8203)));
            }
        }
    }
}