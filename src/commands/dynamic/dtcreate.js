const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');
const { Random } = require('../../utils/');
module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'dtcreate',
                description: 'Creates your own private text channels\n You can invite other users using \`dtinvite <...Mentions>\`',
                permission: 'User',
            },
            options: {
                aliases: ['textcreate'],
                clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            },
        });
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     * @param {import('../../classes/Guild')} guildSettings
     */
    async run(client, message, args, guildSettings) {
        const category = guildSettings.dynamicCategory;
        const enabled = guildSettings.dynamicEnabled;
        if (!category || !enabled || !message.guild.channels.cache.get(category)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Hey, Dynamic Feature is disabled or Dynamic Category cannot be found, contact server admins to enable/fix this\nSetup Dynamic Text/Voice System using `config` command!')
            );
        }
        if (message.channel.parentID === category) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Hey, you can\'t create a dynamic text inside a dynamic text channel')
            );
        }
        const hasAlready = message.guild.channels.cache.filter((c) => c.type === 'text').find((c) => {
            return new RegExp(message.author.id, 'g').test(c.topic);
        });
        const categoryC = message.guild.channels.cache.get(category);
        const CateSize = categoryC.children.filter((c) => c.type === 'text').size;
        if (hasAlready || CateSize >= 10) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Hey, you can\'t create an another dynamic text')
            );
        }
        const channel = await message.guild.channels.create(Random.string(16), {
            type: 'text',
            parent: category,
            topic: `Owner: ${message.author.id}\nDon't change owner ID otherwise the bot might not work properly on this channel`,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS'],
                },
                {
                    id: client.user.id,
                    allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES'],
                }
            ],
        }).catch((e) => { throw e });
        await message.channel.send(new MessageEmbed()
            .setColor(0x00FF00)
            .setDescription(`Your private text channel has been created! <#${channel.id}>`)
            .setTimestamp()
            .setAuthor('Unicron Dynamic Text System', client.user.displayAvatarURL({ dynamic: true }))
        );
        const st = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'dynamic mod');
        if (st) {
            channel.createOverwrite(st, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                MANAGE_CHANNELS: true,
            }).catch(() => { });
        }
        await channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
            .setDescription(`Hello ${message.author.tag}, welcome to your own private text channel!\n
You can invite other users to this text channel using
\`\`\`xl
dtinvite <...Mentions> (On This Channel Only)
\`\`\`
Plus! you can change the channel name to whatever you want <3
            `)
        );
        return true;
    }
}