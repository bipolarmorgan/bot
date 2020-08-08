const ms = require('ms');
const Pagination = require('../../utils/Pagination');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'config',
                description: 'Configure Unicron\'s settings for this server.',
                permission: 'Server Administrator',
            },
            options: {
                aliases: ['conf'],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'config view [page]\nconfig set <key> <value>\nconfig reset\nconfig reset [key]',
                donatorOnly: false,
            }
        });
        this.settings = [
            'prefix', 'modLogChannel', 'autoModeration', 'autoModAction', 'autoModDuration',
            'warnThreshold', 'warnThresholdAction', 'warnActionDuration',
            'welcomeChannel', 'welcomeMessage', 'welcomeEnabled',
            'farewellChannel', 'farewellMessage', 'farewellEnabled',
            'inviteFilter', 'swearFilter', 'mentionSpamFilter',
            'verificationChannel', 'verificationType', 'verificationRole', 'verificationEnabled',
            'ticketCategory', 'ticketEnabled',
        ];
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     * @param {import('../../classes/Guild')} guildSettings
     */
    async run(client, message, args, guildSettings) {
        const [action, key, ...value] = args;
        if (action === 'view') {
            const inviteFilter = guildSettings.inviteFilter ? 'TRUE' : 'FALSE';
            const mentionSpamFilter = guildSettings.mentionSpamFilter ? 'TRUE' : 'FALSE';
            const swearFilter = guildSettings.swearFilter ? 'TRUE' : 'FALSE';
            const dynamicCategory = guildSettings.dynamicCategory ? `<@#${guildSettings.dynamicCategory}>` : `\`none\``;
            const dynamicRoom = guildSettings.dynamicRoom ? `<@#${guildSettings.dynamicRoom}>` : `\`none\``;
            const dynamicEnabled = guildSettings.dynamicEnabled ? 'TRUE' : 'FALSE';
            const welcomeChannel = guildSettings.welcomeChannel ? `<#${guildSettings.welcomeChannel}>` : '\`none\`';
            const welcomeMessage = guildSettings.welcomeMessage;
            const welcomer = guildSettings.welcomeEnabled ? 'TRUE' : 'FALSE';
            const farewellChannel = guildSettings.farewellChannel ? `<#${guildSettings.farewellChannel}>` : '\`none\`';
            const farewellMessage = guildSettings.farewellEnabled;
            const farewell = guildSettings.farewellEnabled ? 'TRUE' : 'FALSE';
            const memberVerification = guildSettings.verificationEnabled ? 'TRUE' : 'FALSE';
            const verificationChannel = guildSettings.verificationChannel ? `<#${guildSettings.verificationChannel}>` : '\`none\`';
            const verifiedRole = guildSettings.verificationRole ? `<@&${guildSettings.verificationRole}>` : '\`none\`';
            const verificationType = guildSettings.verificationType;
            const ticketSystem = guildSettings.ticketEnabled ? 'TRUE' : 'FALSE';
            const ticketCategory = guildSettings.ticketCategory ? `<@#${guildSettings.ticketCategory}>` : '\`none\`';
            const prefix = guildSettings.prefix;
            const modLogChannel = guildSettings.modLogChannel ? `<#${guildSettings.modLogChannel}>` : '\`none\`';
            const autoModeration = guildSettings.autoModeration ? 'TRUE' : 'FALSE';
            const autoModAction = `${guildSettings.autoModAction} MEMBER`;
            const autoModDuration = guildSettings.autoModDuration ? ms(guildSettings.autoModDuration) : '0s';
            const warnThreshold = guildSettings.warnThreshold;
            const warnThresholdAction = guildSettings.warnThresholdAction;
            const warnActionDuration = guildSettings.warnActionDuration ? ms(guildSettings.warnActionDuration) : '0s';
            const embeds = [
                new MessageEmbed()
                    .setColor('RANDOM')
                    .setTimestamp()
                    .addField('Key', `
                    \`prefix\`
                    \`modLogChannel\`
                    \`autoModeration\`
                    \`autoModAction\`
                    \`autoModDuration\`
                    \`warnThreshold\`
                    \`warnThresholdAction\`
                    \`warnActionDuration\`
                    `, true)
                    .addField('Value', `
                    \`${prefix}\`
                    ${modLogChannel}
                    \`${autoModeration}\`
                    \`${autoModAction}\`
                    \`${autoModDuration}\`
                    \`${warnThreshold}\`
                    \`${warnThresholdAction}\`
                    \`${warnActionDuration}\`
                    `, true),
                new MessageEmbed()
                    .setColor('RANDOM')
                    .setTimestamp()
                    .addField('Key', `
                    \`inviteFilter\`
                    \`swearFilter\`
                    \`mentionSpamFilter\`
                    \`dynamicCategory\`
                    \`dynamicRoom\`
                    \`dynamicEnabled\`
                    `, true)
                    .addField('Value', `
                    \`${inviteFilter}\`
                    \`${swearFilter}\`
                    \`${mentionSpamFilter}\`
                    ${dynamicCategory}
                    ${dynamicRoom}
                    \`${dynamicEnabled}\`
                    `, true),
                new MessageEmbed()
                    .setColor('RANDOM')
                    .setTimestamp()
                    .addField('Key', `
                    \`welcomerEnabled\`
                    \`welcomeChannel\`
                    \`welcomeMessage\`
                    \`farewellEnabled\`
                    \`farewellChannel\`
                    \`farewellMessage\`
                    `, true)
                    .addField('Value', `
                    \`${welcomer}\`
                    ${welcomeChannel}
                    \`${welcomeMessage}\`
                    \`${farewell}\`
                    ${farewellChannel}
                    \`${farewellMessage}\`
                    `, true),
                new MessageEmbed()
                    .setColor('RANDOM')
                    .setTimestamp()
                    .addField('Key', `
                    \`verificationEnabled\`
                    \`verificationChannel\`
                    \`verificationRole\`
                    \`verificationType\`
                    \`ticketEnabled\`
                    \`ticketCategory\`
                    `, true)
                    .addField('Value', `
                    \`${memberVerification}\`
                    ${verificationChannel}
                    ${verifiedRole}
                    \`${verificationType}\`
                    \`${ticketSystem}\`
                    ${ticketCategory}
                    `, true),
            ];
            Pagination(message, embeds);
        } else if (action === 'reset') {
            if (!key || !this.settings.includes(key)) {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`Oops, that's invalid key, please do \`${guildSettings.prefix}config view\` for valid keys!`)
                );
            }
            const yn = await client.awaitReply(message, `Are you sure to reset Unicron\'s \`${key !== 'all' ? key : 'settings'}\` for this server (yes/no)? _You have 15 seconds to comply_`, 15000);
            if (!['y', 'yes', 'YES'].includes(yn)) return message.channel.send('Request terminated.');
            switch (key) {
                case 'all': {
                    guildSettings.prefix = '-';
                    guildSettings.modLogChannel = '';
                    guildSettings.autoModeration = false;
                    guildSettings.autoModAction = 'MUTE';
                    guildSettings.autoModDuration = 0;
                    guildSettings.warnThreshold = 0;
                    guildSettings.warnThresholdAction = 'MUTE';
                    guildSettings.warnActionDuration = 0;
                    guildSettings.welcomeChannel = '';
                    guildSettings.welcomeEnabled = false;
                    guildSettings.welcomeMessage = '{user} has joined the server!';
                    guildSettings.farewellChannel = '';
                    guildSettings.farewellEnabled = false;
                    guildSettings.farewellMessage = '{user} has left the server.';
                    guildSettings.dynamicCategory = '';
                    guildSettings.dynamicRoom = '';
                    guildSettings.dynamicEnabled = false;
                    guildSettings.verificationChannel = '';
                    guildSettings.verificationType = 'discrim';
                    guildSettings.verificationRole = '';
                    guildSettings.verificationEnabled = false;
                    guildSettings.inviteFilter = false;
                    guildSettings.swearFilter = false;
                    guildSettings.mentionSpamFilter = false;
                    guildSettings.ticketCategory = '';
                    guildSettings.ticketEnabled = false;
                    break;
                }
                case 'prefix': {
                    guildSettings.prefix = '-';
                    break;
                }
                case 'welcomeChannel': {
                    guildSettings.welcomeChannel = '';
                    guildSettings.welcomeEnabled = false;
                    break;
                }
                case 'welcomeMessage': {
                    guildSettings.welcomeMessage = '{user} has joined the server!';
                    break;
                }
                case 'farewellChannel': {
                    guildSettings.farewellChannel = '';
                    guildSettings.farewellEnabled = false;
                    break;
                }
                case 'farewellMessage': {
                    guildSettings.farewellMessage = '{user} has left the server.';
                    break;
                }
                case 'modLogChannel': {
                    guildSettings.modLogChannel = '';
                    break;
                }
                case 'autoModeration': {
                    guildSettings.autoModeration = false;
                    break;
                }
                case 'autoModAction': {
                    guildSettings.autoModAction = 'MUTE';
                    break;
                }
                case 'autoModDuration': {
                    guildSettings.autoModDuration = 0;
                    break;
                }
                case 'warnThreshold': {
                    guildSettings.warnThreshold = 0;
                    break;
                }
                case 'warnThresholdAction': {
                    guildSettings.warnThresholdAction = 'MUTE';
                    break;
                }
                case 'warnActionDuration': {
                    guildSettings.warnActionDuration = 0;
                    break;
                }
                case 'welcomeChannel': {
                    guildSettings.welcomeChannel = '';
                    guildSettings.welcomeEnabled = false;
                    break;
                }
                case 'welcomeMessage': {
                    guildSettings.welcomeMessage = '{user} has joined the server!';
                    break;
                }
                case 'welcomeEnabled': {
                    guildSettings.welcomeEnabled = false;
                    break;
                }
                case 'farewellChannel': {
                    guildSettings.farewellChannel = '';
                    guildSettings.farewellEnabled = false;
                    break;
                }
                case 'farewellMessage': {
                    guildSettings.farewellMessage = '{user} has left the server.';
                    break;
                }
                case 'farewellEnabled': {
                    guildSettings.farewellEnabled = false;
                    break;
                }
                case 'dynamicCategory': {
                    guildSettings.dynamicCategory = '';
                    guildSettings.dynamicEnabled = false;
                    break;
                }
                case 'dynamicRoom': {
                    guildSettings.dynamicRoom = '';
                    break;
                }
                case 'dynamicEnabled': {
                    guildSettings.dynamicEnabled = false;
                    break;
                }
                case 'verificationChannel': {
                    guildSettings.verificationChannel = '';
                    guildSettings.verificationEnabled = false;
                    break;
                }
                case 'verificationType': {
                    guildSettings.verificationType = 'discrim';
                    break;
                }
                case 'verificationRole': {
                    guildSettings.verificationRole = '';
                    guildSettings.verificationEnabled = false;
                    break;
                }
                case 'verificationEnabled': {
                    guildSettings.verificationEnabled = false;
                    break;
                }
                case 'inviteFilter': {
                    guildSettings.inviteFilter = false;
                    break;
                }
                case 'swearFilter': {
                    guildSettings.swearFilter = false;
                    break;
                }
                case 'mentionSpamFilter': {
                    guildSettings.mentionSpamFilter = false;
                    break;
                }
                case 'ticketCategory': {
                    guildSettings.ticketCategory = '';
                    guildSettings.ticketEnabled = false;
                    break;
                }
                case 'ticketEnabled': {
                    guildSettings.ticketEnabled = false;
                    break;
                }
            }
            await guildSettings.save().catch((e) => { throw e; });
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`Successfully reseted Unicron\'s \`${key !== 'all' ? key : 'settings'}\` for this server.`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        } else if (action === 'set') {
            try {
                switch (key) {
                    case 'farewellMessage':
                    case 'welcomeMessage': {
                        if (!value.join(' ').includes('{user}')) throw `Sorry, the placeholder \`{user}\` is not provided in the message, please add \`{user}\` in order to work!`;
                        guildSettings[key] = value.join(' ').replace(/@/g, String.fromCharCode(8203));
                        break;
                    }
                    case 'warnThresholdAction':
                    case 'autoModAction': {
                        if (!value[0] || !['MUTE', 'KICK', 'SOFTBAN', 'BAN'].includes(value[0].toUpperCase())) throw `Oopsie, That's an invalid action type bud,\nValid Types: \`MUTE\`, \`KICK\`, \`SOFTBAN\`, \`BAN\``;
                        guildSettings[key] = value[0].toUpperCase();
                        break;
                    }
                    case 'prefix': {
                        if (!value[0] || value[0].length > 5) throw 'Sorry, but the prefix cannot exceed more than 5 characters ;-;';
                        guildSettings[key] = value[0];
                        break;
                    }
                    case 'welcomeChannel':
                    case 'farewellChannel':
                    case 'verificationChannel':
                    case 'modLogChannel': {
                        const channel = client.resolveChannel(value.join(' '), message.guild);
                        if (!channel) throw `Sorry, that\'s an invalid channel, please use \`${guildSettings.prefix}config set ${key} [ChannelMention|ChannelName]\``;
                        guildSettings[key] = channel.id;
                        break;
                    }
                    case 'autoModeration':
                    case 'dynamicEnabled':
                    case 'farewellEnabled':
                    case 'welcomeEnabled':
                    case 'verificationEnabled':
                    case 'ticketEnabled': {
                        if (!value[0] || !['TRUE', 'FALSE'].includes(value[0].toUpperCase())) throw `Sorry, that\'s an invalid boolean, please use \`${guildSettings.prefix}config set ${key} <TRUE|FALSE>\` to set this up!`;
                        guildSettings[key] = value[0].toUpperCase() === 'TRUE' && ['TRUE', 'FALSE'].includes(value[0].toUpperCase());
                        break;
                    }
                    case 'autoModDuration':
                    case 'warnActionDuration': {
                        const duration = ms(value.join(' '));
                        if (!duration || isNaN(duration)) throw `Sorry, that's an invalid duration, please use \`${guildSettings.prefix}config set ${key} <Duration>\` like \`5m\` for 5 minutes, \`1h\` for an hour.. etc.`;
                        guildSettings[key] = duration;
                        break;
                    }
                    case 'verificationRole': {
                        const role = client.resolveRole(value.join(' '), message.guild);
                        if (!role) throw `Sorry, that's an invalid role, please use \`${guildSettings.prefix}config set ${key} <RoleID|RoleName>\` and try again!`;
                        guildSettings[key] = role.id;
                        break;
                    }
                    case 'verificationType': {
                        if (!['discrim', 'react', 'captcha'].includes(value[0].toLowerCase())) throw `Sorry, that's an invalid verification type, please use either \`discrim\`, \`react\` or \`captcha\` and try again!`;
                        guildSettings[key] = value[0].toLowerCase();
                        break;
                    }
                    case 'warnThreshold': {
                        if (isNaN(Number(value[0]))) throw `Sorry, that is not a number, please use \`${guildSettings.prefix}config set ${key} <Number>\` instead!`;
                        guildSettings[key] = Number(value[0]);
                        break;
                    }
                    default:
                        throw `Oopsie, That's an Invalid Key Value, please do \`${guildSettings.prefix}config view [page]\` for more Key Values! CASE-SENSITIVE`;
                }
            } catch (e) {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(e)
                );
            }
            await guildSettings.save().catch((e) => { throw e; });
            return message.channel.send(new MessageEmbed()
                .setColor(0x00FF00)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Successfully changed **${key}** to a new value!`)
            );
        }
    }
}